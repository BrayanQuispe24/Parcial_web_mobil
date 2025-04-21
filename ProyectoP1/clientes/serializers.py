from rest_framework import serializers
from usuarios.models import CustomUser

class RegisterSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    nombre=serializers.CharField()
    apellido=serializers.CharField()
    telefono=serializers.CharField()
    direccion=serializers.CharField()
    estado=serializers.CharField()
    usuario=serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    