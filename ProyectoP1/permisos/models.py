from django.db import models
from usuarios.models import CustomUser

# Create your models here.
class Permisos(models.Model):
        id=models.AutoField(primary_key=True)
        crear=models.BooleanField()
        eliminar=models.BooleanField()
        actualizar=models.BooleanField()
        ver=models.BooleanField()
        usuario=models.ForeignKey(CustomUser,on_delete=models.SET_NULL,null=True)
        class Meta:
         db_table='permiso'
           