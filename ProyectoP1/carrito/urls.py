from django.urls import path
from . import views

urlpatterns = [
    path('obtener_carritos', views.obtener_carritos),
    path('obtener_carrito/<int:id>/', views.obtener_carrito_id),
    path('crear/', views.crear_carrito),
    path('actualizar/', views.actualizar_carrito),
]
