from django.shortcuts import render
# Importa la clase base para crear vistas personalizadas en DRF
from rest_framework.views import APIView
# Importa la clase Response para devolver respuestas HTTP personalizadas
from rest_framework.response import Response
# Importa los códigos de estado HTTP, como 200, 400, 201, etc.
from rest_framework import status,viewsets
# Importa el modelo Token para manejar autenticación con tokens
from rest_framework.authtoken.models import Token
# Importa la función authenticate de Django, que valida credenciales de usuarios
from django.contrib.auth import authenticate
# Importa el serializer que se utilizará para registrar nuevos usuarios
from usuarios.serializer import RegisterSerializer,UserAdminSerializer
# Importa el modelo de usuario personalizado
from .models import CustomUser
from rest_framework.permissions import IsAuthenticated
from .permisos import IsAdminUserCustom
from rest_framework.permissions import IsAdminUser
from rest_framework import filters
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission
from rest_framework.decorators import api_view, permission_classes

# Create your views here.

#vista para registrar nuevos usuarios 
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            return Response({'mensaje': 'Usuario creado exitosamente'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

     
# Vista para autenticar usuarios (inicio de sesión)
class LoginView(APIView):
    # Método que maneja las solicitudes POST para iniciar sesión
    def post(self,request):
        #obtenemos el email y la contrasenia enviados en la solicitud 
        email=request.data.get('email')
        password=request.data.get('password')
        
        #autentica al usuario usando el backend de authentication de django
        user=authenticate(request,email=email,password=password)
        #si el usuario es valido y fue autenticado correctamente 
        if(user):
            #obtiene o crea el token de autenticacion para el usuario
            token,_=Token.objects.get_or_create(user=user)
            #devuelve el token y el rol del usuario en la respuesta
            return Response({'token':token.key,'role':user.role})
     #si las credenciales no son validass, devuelve un mensaje de error
        return Response({'error':'Credenciales invalidas'},status=status.HTTP_400_BAD_REQUEST)    
# Vista solo accesible por administradores para CRUD de usuarios
class UserAdminViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUserCustom]  # Solo admins autenticados

    # Dependiendo de la acción, usamos un serializer diferente
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return RegisterSerializer  # para crear y editar
        return UserAdminSerializer  # para listar/ver    
    
# Vista solo para que el admin cree usuarios con cualquier rol
class AdminCreateUserView(APIView):
    # Solo usuarios autenticados y con permisos de admin pueden usar esta vista
    permission_classes = [IsAdminUser]

    def post(self, request):
        # Pasamos el request al serializer para contexto (aunque en este caso no es obligatorio porque ya es admin)
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user = serializer.save()
            return Response({'mensaje': 'Usuario creado por el admin exitosamente'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#vista para obtener todos los usuarios 

class AllUsersView(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUserCustom]
    filter_backends = [filters.SearchFilter]
    search_fields = ['email']

class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]  # Asegura que solo los usuarios autenticados pueden acceder

    def put(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Verificar si el usuario autenticado tiene permiso para modificar los datos
        if request.user != user and not request.user.is_staff:
            raise PermissionDenied("No tienes permiso para actualizar este usuario.")
        
        # Si es un ADMIN, podrá modificar cualquier usuario
        if request.user.is_staff or request.user == user:
            serializer = RegisterSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({'mensaje': 'Usuario actualizado exitosamente'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'error': 'Permiso denegado'}, status=status.HTTP_403_FORBIDDEN)


class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]  # Asegura que solo los usuarios autenticados pueden acceder

    def delete(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Verificar si el usuario autenticado tiene permiso para eliminar el usuario
        if request.user != user and not request.user.is_staff:
            raise PermissionDenied("No tienes permiso para eliminar este usuario.")
        
        # Si es un ADMIN o el propio usuario, podrá eliminar el usuario
        if request.user.is_staff or request.user == user:
            user.delete()
            return Response({'mensaje': 'Usuario eliminado exitosamente'}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({'error': 'Permiso denegado'}, status=status.HTTP_403_FORBIDDEN)    

# Permiso personalizado para verificar si el usuario tiene rol ADMIN
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        # Solo permite el acceso si el usuario es un admin
        return request.user.role == 'ADMIN'


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_by_email(request):
    email = request.query_params.get('email')
    
    if not email:
        return Response({'error': 'El parámetro "email" es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email=email)
        serializer = UserAdminSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)


class UpdateUserViewOnlyAdmin(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]  # Solo los admins pueden acceder

    def put(self, request, pk):
        # Obtenemos al usuario que se va a actualizar
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Extraemos los datos del cuerpo de la solicitud
        first_name = request.data.get("first_name")
        email = request.data.get("email")
        new_role = request.data.get("role")
        new_password = request.data.get("password")  # Nuevo campo de contraseña

        # Validamos si el rol proporcionado es válido
        if new_role and new_role not in dict(CustomUser.ROLE_CHOICES):
            return Response({"detail": "Rol no válido."}, status=status.HTTP_400_BAD_REQUEST)

        # Si el first_name o email están presentes, actualizamos esos campos
        if first_name:
            user.first_name = first_name
        
        if email:
            user.email = email

        # Si el nuevo rol está presente, actualizamos el rol
        if new_role:
            user.role = new_role

        # Si se proporciona una nueva contraseña, la actualizamos
        if new_password:
            user.set_password(new_password)

        # Guardamos los cambios
        user.save()

        return Response({"message": "Usuario actualizado correctamente."}, status=status.HTTP_200_OK)