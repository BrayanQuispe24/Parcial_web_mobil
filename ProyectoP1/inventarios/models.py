from django.db import models
from productos.models import Producto

# Create your models here.
class Inventario(models.Model):
    id=models.AutoField(primary_key=True)
    costo=models.DecimalField(max_digits=10,decimal_places=2)
    cantidad=models.IntegerField()
    producto=models.ForeignKey(Producto,on_delete=models.SET_NULL,null=True)
    
    class Meta:
        db_table='inventario'