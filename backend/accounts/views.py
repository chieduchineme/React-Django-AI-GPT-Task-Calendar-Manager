from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import UserSerializer
from django.contrib.auth import authenticate
from .tokens import CustomRefreshToken
from django.contrib.auth import get_user_model
User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
  username = request.data.get('username')
  password = request.data.get('password')

  user = authenticate(username=username, password=password)

  if user is None:
    return Response({'error': 'Incorrect username or password.'}, status=400)

  refresh = CustomRefreshToken(user)
  data = {'access_token': str(refresh.access_token), 'refresh_token': str(refresh)}

  return Response(data, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def user_create(request):
  # user needs a name, username, and password
  serializer = UserSerializer(data=request.data)
  if serializer.is_valid():
    user = serializer.create(validated_data=request.data)
    
    refresh = CustomRefreshToken(user)
    data = {'access_token': str(refresh.access_token), 'refresh_token': str(refresh)}
    return Response(data, status=201)

  if 'username' in serializer.errors:
    return Response({'error': 'Username already exists'}, status=400)

  return Response({'error': 'Something went wrong'}, status=400)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def user_update(request):  
  try:
    user = User.objects.get(pk=request.user.id)
  except User.DoesNotExist:
    return Response(status=404)
  
  serializer = UserSerializer(user, data=request.data, partial=True)

  if serializer.is_valid():
    user = serializer.update(user, validated_data=request.data)
    return Response(status=201)
  return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def user_delete(request):
  try:
    user = User.objects.get(pk=request.user.id)
  except User.DoesNotExist:
    return Response(status=404)
  
  user.delete()
  return Response(status=204)


