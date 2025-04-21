from django.db import models

# Create your models here.
class Marca(models.Model):
    id=models.AutoField(primary_key=True)
    nombre=models.CharField(max_length=255)
    estado=models.BooleanField()
    
    class Meta:
        db_table="marca"