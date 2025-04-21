from django.urls import path
from . import views

urlpatterns = [
    path('obtener_facturas', views.obtener_facturas),
    path('obtener/<int:id>/', views.obtener_factura_id),
    path('crear/', views.crear_factura),
    path('actualizar/', views.actualizar_factura),
]
