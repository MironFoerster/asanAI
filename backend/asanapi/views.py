from .serializers import DataPipeSerializer, LabSerializer, LessonSerializer, TFModelSerializer
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import authenticate
from .models import Lab, Lesson, TFModel, User, DataPipe
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.contrib.auth.decorators import login_required
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from wonderwords import RandomWord


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def dashboard_labs(request):
    labs = request.user.labs.all()
    shared_labs = request.user.shared_labs.all()
    print(labs)
    print(shared_labs)
    lab_serializer = LabSerializer(labs, many=True, context={'request': request})
    shared_lab_serializer = LabSerializer(shared_labs, many=True, context={'request': request})
    print(lab_serializer.data)
    print(shared_lab_serializer.data)
    return Response({"labs":lab_serializer.data, "shared_labs": shared_lab_serializer.data})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def new_lab(request):
    lab = Lab(user=request.user)
    r = RandomWord()
    adjective = r.word(include_parts_of_speech=["adjectives"])
    noun = r.word(include_parts_of_speech=["nouns"])

    lab.name = f"{adjective} {noun}"
    lab.save()
    return Response(lab.id)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_lab(request, id):
    try:
        lab = request.user.labs.get(id=id)
    except Lab.DoesNotExist:
        try:
            lab = request.user.shared_labs.get(id=id)
        except Lab.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = LabSerializer(lab, context={'request': request})
    return Response(serializer.data)

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
def get_lab_access(request, id):
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


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def get_details(request, tp):
    print(request.user)
    if tp == "labs":
        labs = Lab.objects.filter(public=False)
        print(labs)
        labserializer = LabSerializer(labs, many=True, context={'request': request})
        print(labserializer.data)
        return Response(labserializer.data)
    elif tp == "pipes":
        pipes = DataPipe.objects.all()
        pipeserilizer = DataPipeSerializer(pipes, many=True, context={'request': request})
        return Response(pipeserilizer.data)
    elif tp == "models":
        models = TFModel.objects.all()
        modelserializer = TFModelSerializer(models, many=True, context={'request': request})
        return Response(modelserializer.data)
    elif tp == "lessons":
        lessons = Lesson.objects.all()
        lessonserializer = LessonSerializer(lessons, many=True, context={'request': request})
        return Response(lessonserializer.data)