from rest_framework import serializers
from metodoPago.models import Metodo_Pago

class MetodoPagoSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField()
    nombre=serializers.CharField()