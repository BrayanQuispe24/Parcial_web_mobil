from django.db import models
from productos.models import Producto

# Create your models here.
class Precio(models.Model):
    id=models.AutoField(primary_key=True)
    precio=models.DecimalField(max_digits=10,decimal_places=2)
    fecha_inicio=models.DateField()
    fecha_final=models.DateField()
    producto=models.ForeignKey(Producto,on_delete=models.SET_NULL,null=True)
    class Meta:
        db_table='precio'