from rest_framework import serializers
from carrito.models import CarritoCompras
from productos.models import Producto

class DetalleCarrito(serializers.Model):
    id=serializers.AutoField(primary_key=True)
    cantidad=serializers.IntegerField()
    precio_unitario=serializers.DecimalField()
    subTotal=serializers.DecimalField()
    carrito=serializers.ForeignKey(queryset=CarritoCompras)
    producto=serializers.ForeignKey(queryset=Producto.objects.all())