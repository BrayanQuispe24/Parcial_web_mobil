from rest_framework import serializers
from permisos.models import Permisos
#serializador para los permisos
class PermisoSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    crear=serializers.BooleanField()
    eliminar=serializers.BooleanField()
    actualizar=serializers.BooleanField()
    ver=serializers.BooleanField()
    usuario=serializers.PrimaryKeyRelatedField(queryset=Permisos.objects.all())
    