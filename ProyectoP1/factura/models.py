from django.db import models
from metodoPago.models import Metodo_Pago
from clientes.models import Cliente

# Create your models here.
class Factura(models.Model):
    id=models.AutoField(primary_key=True)
    fecha=models.DateField()
    total=models.DecimalField(max_digits=10,decimal_places=2)
    estado=models.CharField()
    metodo=models.ForeignKey(Metodo_Pago,on_delete=models.SET_NULL,null=True)
    cliente=models.ForeignKey(Cliente,on_delete=models.SET_NULL,null=True)
    
    class Meta:
        db_table='factura'
    
    