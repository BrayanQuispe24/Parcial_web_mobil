# urls.py
from django.urls import path
from .views import crear_marca, actualizar_marca, obtener_marcas, obtener_marca

urlpatterns = [
    path('crear/', crear_marca),
    path('actualizar/', actualizar_marca),
    path('obtener_marcas', obtener_marcas),
    path('obtener_marca/<int:id>', obtener_marca),
]
