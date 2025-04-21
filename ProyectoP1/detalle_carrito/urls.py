from django.urls import path
from . import views

urlpatterns = [
    path('obtener_detalles', views.obtener_detalles_carrito),
    path('obtener_detalle/<int:id>/', views.obtener_detalle_carrito_id),
    path('crear/', views.crear_detalle_carrito),
    path('actualizar/', views.actualizar_detalle_carrito),
]
