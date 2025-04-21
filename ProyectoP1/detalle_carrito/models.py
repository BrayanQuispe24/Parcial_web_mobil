from django.db import models
from carrito.models import CarritoCompras
from productos.models import Producto

# Create your models here.
class DetalleCarrito(models.Model):
    id=models.AutoField(primary_key=True)
    cantidad=models.IntegerField()
    precio_unitario=models.DecimalField(max_digits=10,decimal_places=2)
    subTotal=models.DecimalField(max_digits=10,decimal_places=2)
    carrito=models.ForeignKey(CarritoCompras,on_delete=models.SET_NULL,null=True)
    producto=models.ForeignKey(Producto,on_delete=models.SET_NULL,null=True)
    
    class Meta:
        db_table='detalle_carrito'