from rest_framework import serializers
from productos.models import Producto

class ImagenesSerializer(serializers.ModelSerializer):
     id=serializers.AutoField(primary_key=True),
     url=serializers.CharField(max_length=255),
     producto=serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())
    