from django.db import models
from productos.models import Producto
from factura.models import Factura

# Create your models here.
class DetalleFactura(models.Model):
    id=models.AutoField(primary_key=True)
    cantidad=models.IntegerField()
    precio_unitario=models.DecimalField(max_digits=10,decimal_places=2)
    producto=models.ForeignKey(Producto,on_delete=models.SET_NULL,null=True)
    factura=models.ForeignKey(Factura,on_delete=models.SET_NULL,null=True)
    
    class Meta:
        db_table='detalle_factura'
