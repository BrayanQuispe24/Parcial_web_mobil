from rest_framework import serializers
from carrito.models import CarritoCompras

class CarritoSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField()
    total=serializers.DecimalField()
    fecha=serializers.DateField()
    estado=serializers.CharField()
    cliente=serializers.PrimaryKeyRelatedField(queryset=CarritoCompras.objects.all())