# Importa las clases necesarias de Django REST Framework
from rest_framework import serializers
# Importa el modelo CustomUser, que es el modelo de usuario personalizado
from .models import CustomUser

# Define el serializer para el registro de un nuevo usuario
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'password', 'role']

    def create(self, validated_data):
        # Extraemos el rol proporcionado por el usuario (si existe)
        requested_role = validated_data.get('role', 'CLIENT')

        # Obtenemos el usuario que está haciendo la petición desde el contexto
        request = self.context.get('request')
        current_user = request.user if request else None

        # Si el usuario no está autenticado o no es staff (admin),
        # se fuerza el rol a CLIENT sin importar lo que manden
        if not current_user or not current_user.is_staff:
            validated_data['role'] = 'CLIENT'
        else:
            # Si es admin, se permite usar el rol que se envió
            validated_data['role'] = requested_role

        # Extraemos y quitamos la contraseña de los datos validados
        password = validated_data.pop('password')

        # Creamos el usuario con el método del modelo
        user = CustomUser.objects.create_user(password=password, **validated_data)
        return user
# Serializer solo para visualizar usuarios (sin contraseña)
class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'role', 'is_active', 'is_staff']    