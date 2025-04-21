from django.urls import path
from .views import insertar_imagen, obtener_imagen_por_id, obtener_todas_las_imagenes

urlpatterns = [
    path('obtener_imagenes', obtener_todas_las_imagenes),
    path('imagenes/<int:id>/', obtener_imagen_por_id),
    path('crear/', insertar_imagen),
]
