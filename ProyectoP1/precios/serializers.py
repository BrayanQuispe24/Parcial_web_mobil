from rest_framework import serializers
from productos.models import Producto

class PrecioSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField()
    precio=serializers.DecimalField()
    fecha_inicio=serializers.DateField()
    fecha_final=serializers.DateField()
    producto=serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())