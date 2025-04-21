from django.urls import path
from . import views

urlpatterns = [
    path('obtener_detalles', views.obtener_detalles_factura),
    path('obtener_detalle/<int:id>/', views.obtener_detalle_factura_id),
    path('crear/', views.crear_detalle_factura),
    path('actualizar/', views.actualizar_detalle_factura),
]
