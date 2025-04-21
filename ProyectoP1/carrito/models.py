from django.db import models
from clientes.models import Cliente

# Create your models here.
class CarritoCompras(models.Model):
    id=models.AutoField(primary_key=True)
    total=models.DecimalField(max_digits=10,decimal_places=2)
    fecha=models.DateField()
    estado=models.CharField()
    cliente=models.ForeignKey(Cliente,on_delete=models.SET_NULL,null=True)
    
    class Meta:
        db_table='carrito_compra'