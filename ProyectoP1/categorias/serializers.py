from rest_framework import serializers
from categorias.models import categoria

class CategoriaSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField()
    nombre=serializers.CharField()