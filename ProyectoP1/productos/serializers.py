from rest_framework import serializers
from productos.models import Producto
from marcas.models import Marca
from categorias.models import Categoria

class ProductoSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField()
    descripcion=serializers.CharField()
    estado=serializers.CharField()
    marca=serializers.PrimaryKeyRelatedField(queryset=Marca.objects.all())
    categoria=serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all())
    