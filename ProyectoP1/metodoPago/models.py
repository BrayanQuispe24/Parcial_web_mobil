from django.db import models

# Create your models here.
class Metodo_Pago(models.Model):
    id=models.AutoField(primary_key=True)
    nombre=models.CharField(max_length=255)
    
    class Meta:
        db_table='metodo_pago'