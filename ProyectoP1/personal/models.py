from django.db import models
from usuarios.models import CustomUser

# Create your models here.
class Personal(models.Model):
    id=models.AutoField(primary_key=True)
    nombre=models.CharField(max_length=100)
    apellido=models.CharField(max_length=100)
    telefono=models.CharField(max_length=20)
    direccion=models.CharField(max_length=255)
    fecha_nacimiento=models.DateField()
    rol=models.CharField(max_length=20)
    usuario=models.ForeignKey(CustomUser,on_delete=models.SET_NULL,null=True)
    
    class Meta:
        db_table='personal'
