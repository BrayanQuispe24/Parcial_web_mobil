from django.urls import path
from . import views

urlpatterns = [
    path('obtener_all', views.obtener_inventario),
    path('obtener/<int:id>', views.obtener_inventario_id),
    path('crear/', views.crear_inventario),
    path('actualizar/', views.actualizar_inventario),
]
