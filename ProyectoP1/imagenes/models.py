from django.db import models
from productos.models import Producto

# Create your models here.
class Imagenes(models.Model):
    id=models.AutoField(primary_key=True),
    url=models.CharField(max_length=255)
    producto=models.ForeignKey(Producto,on_delete=models.SET_NULL,null=True)
    class Meta:
        db_table='imagenes'