from rest_framework import serializers
from productos.models import Producto

class InventiarioSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField()
    costo=serializers.DecimalField()
    cantidad=serializers.IntegerField()
    producto=serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())