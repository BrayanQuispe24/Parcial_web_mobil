from rest_framework import serializers
from marcas.models import Marca

class MarcaSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField()
    nombre=serializers.CharField()
    estado=serializers.BooleanField()
    