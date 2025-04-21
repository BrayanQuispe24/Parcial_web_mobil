from rest_framework import serializers
from metodoPago.models import Metodo_Pago
from clientes.models import Cliente

class FacturaSerialzizer(serializers.ModelSerializer):
    id=serializers.IntegerField()
    fecha=serializers.DateField()
    total=serializers.DecimalField()
    estado=serializers.CharField()
    metodo=serializers.PrimaryKeyRelatedField(queryset=Metodo_Pago.objects.all())
    cliente=serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all())
    