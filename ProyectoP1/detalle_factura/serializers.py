from rest_framework import serializers
from productos.models import Producto
from factura.models import Factura

class DetalleFacturaSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField()
    cantidad=serializers.IntegerField()
    precio_unitario=serializers.DecimalField()
    producto=serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())
    factura=serializers.PrimaryKeyRelatedField(queryset=Factura.objects.all())
    