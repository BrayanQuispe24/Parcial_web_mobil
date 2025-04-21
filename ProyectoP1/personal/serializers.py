from rest_framework import serializers
from personal.models import Personal

class PersonalSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField()
    nombre=serializers.CharField()
    apellido=serializers.CharField()
    direccion=serializers.CharField()
    fecha_nacimiento=serializers.DateField()
    rol=serializers.CharField()
    usuario=serializers.PrimaryKeyRelatedField(queryset=Personal.objects.all())