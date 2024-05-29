from .serializers import PipeDetailsSerializer, PipeSerializer, TFModelDetailsSerializer, LabSerializer, LabDetailsSerializer, LessonSerializer, TFModelSerializer, TrainerSerializer
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import authenticate
from .models import Data, Lab, LabVersion, Lesson, TFModel, TFModelVersion, Trainer, User, Pipe
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.contrib.auth.decorators import login_required
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from wonderwords import RandomWord
from django.db import transaction
from django.core.files.storage import default_storage


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def dashboard_labs(request):
    labs = request.user.labs.all()
    shared_labs = request.user.shared_labs.all()
    print(labs)
    print(shared_labs)
    lab_serializer = LabDetailsSerializer(labs, many=True, context={'request': request})
    shared_lab_serializer = LabDetailsSerializer(shared_labs, many=True, context={'request': request})
    print(lab_serializer.data)
    print(shared_lab_serializer.data)
    return Response({"labs":lab_serializer.data, "shared_labs": shared_lab_serializer.data})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def new_lab(request):
    with transaction.atomic():
        r = RandomWord()
        adjective = r.word(include_parts_of_speech=["adjectives"])
        noun = r.word(include_parts_of_speech=["nouns"])

        data = Data()
        data.save()

        pipe = Pipe(data=data)
        pipe.save()

        model = TFModel()
        model.save()

        trainer = Trainer()
        trainer.save()

        lab = Lab(user=request.user, name=f"{adjective} {noun}", model=model, pipe=pipe, trainer=trainer)
        lab.save()

        print(lab.trainer.loss)
    return Response(lab.id)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_lab_data(request, id, v=0):
    try:
        lab = request.user.labs.get(id=id)
    except Lab.DoesNotExist:
        try:
            lab = request.user.shared_labs.get(id=id)
        except Lab.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    lab_serializer = LabSerializer(lab, context={'request': request, 'version': v})
    model_serializer = TFModelSerializer(lab.model, context={'version': v})
    pipe_serializer = PipeSerializer(lab.pipe, context={'version': v})
    trainer_serializer = TrainerSerializer(lab.trainer, context={'version': v})

    response_data = {
        'lab': lab_serializer.data,
        'model': model_serializer.data,
        'pipe': pipe_serializer.data,
        'trainer': trainer_serializer.data,
    }

    return Response(response_data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def share_lab(request):
    print(request.data)
    try:
        lab = request.user.labs.get(id=request.data["labId"])
    except Lab.DoesNotExist:
        print("hehe")
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        share_user = User.objects.get(username=request.data["username"])
    except:
        print("haha")
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    lab.shared_with_users.add(share_user)
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def lab_authorization(request, id):
    lab = Lab.objects.get(id=id)

    if request.user == lab.user:
        return Response("owning")
    elif request.user in lab.shared_with_users.all() or lab.public:
        return Response("viewing")
    else:
        return Response("none")


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def sync_lab(request, id):
    try:
        old_lab = request.user.labs.get(id=id)
    except Lab.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    deserializer = LabSerializer(old_lab, data=request.data)
    if deserializer.is_valid():
        deserializer.save()
    return Response({"message": "Sync Successful"})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def save_model(request, id, v="0"):
    model_file = request.FILES['model.json']
    weights_file = request.FILES['model.weights.bin']
    print("hiya")
    
    # Save the model file to the media backend
    model_file_path = default_storage.save('models/'+id+'/'+v+'/model.json', model_file)
    
    # Save the weights file to the media backend
    weights_file_path = default_storage.save('models/'+id+'/'+v+'/model.weights.bin', weights_file)
    print("hiyo")
    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def save_version(request, id, message):
    try:
        lab = request.user.labs.get(id=id)
    except Lab.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    lab_version = LabVersion(
        lab=lab,
        v=lab.latest_v+1,
        commit_message=message
    )
    lab_version.save()

    model_version = TFModelVersion(
        model = lab.model,
        v = lab.model.latest_v+1,
        model_url = lab.model.model_url # solve how to handle models
    )
    model_version.save()

    pipe_version = TFModelVersion(
        pipe = lab.pipe,
        v = lab.pipe.latest_v+1,
        source = lab.pipe.source,
        pipe_config = lab.pipe.pipe_config # solve how to handle sources
    )
    pipe_version.save()

    return Response({"message": "Version Created Successfully"})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def get_details(request, tp):
    print(request.user)
    if tp == "labs":
        labs = Lab.objects.filter(public=False)
        print(labs)
        labserializer = LabDetailsSerializer(labs, many=True, context={'request': request})
        print(labserializer.data)
        return Response(labserializer.data)
    elif tp == "pipes":
        pipes = Pipe.objects.all()
        pipeserilizer = PipeDetailsSerializer(pipes, many=True, context={'request': request})
        return Response(pipeserilizer.data)
    elif tp == "models":
        models = TFModel.objects.all()
        modelserializer = TFModelDetailsSerializer(models, many=True, context={'request': request})
        return Response(modelserializer.data)
    elif tp == "lessons":
        lessons = Lesson.objects.all()
        lessonserializer = LessonSerializer(lessons, many=True, context={'request': request})
        return Response(lessonserializer.data)