from django.urls import path
from . import views

urlpatterns = [
    path('obtener_precios', views.obtener_precios),
    path('obtener/<int:id>', views.obtener_precio_id),
    path('crear/', views.crear_precio),
    path('actualizar/', views.actualizar_precio),
]
