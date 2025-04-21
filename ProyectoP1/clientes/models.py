from django.db import models
from usuarios.models import CustomUser
# Create your models here.
class Cliente(models.Model):
    id=models.AutoField(primary_key=True)
    nombre=models.CharField(max_length=255)
    apellido=models.CharField(max_length=255)
    telefono=models.CharField(max_length=20)
    direccion=models.CharField(max_length=255)
    estado=models.CharField(max_length=20, default="activo")
    usuario =models.ForeignKey(CustomUser, on_delete=models.SET_NULL,null=True)
    
    class Meta:
        db_table='cliente'
       
        
    
    
    
    