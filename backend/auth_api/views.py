from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.contrib.auth.decorators import login_required
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_data(request):
    serializer = UserSerializer(request.user, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def signin(request):
    user = authenticate(username=request.data['username'], password=request.data['password'])

    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, "username": user.username})
    else:
        print("oops")
        return Response({'error': 'Invalid credentials'}, status=401)

@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    # TODO: validate data
    user = User.objects.create_user(username=username, email=email, password=password)
    token, created = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, "username": user.username})

@login_required
def signout(request):
    request.user.auth_token.delete()
    return Response({"message": "Successfully logged out."}, status=200)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed for {}".format(request.user.username))