from django.db import models
from marcas.models import Marca
from categorias.models import Categoria

# Create your models here.
class Producto(models.Model):
    id=models.AutoField(primary_key=True)
    descripcion=models.CharField(255)
    estado=models.CharField(255)
    marca=models.ForeignKey(Marca,on_delete=models.SET_NULL, null=True)
    categoria=models.ForeignKey(Categoria,on_delete=models.SET_NULL, null=True)
    
    class Meta:
        db_table='producto'