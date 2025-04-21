from django.urls import path
from . import views

urlpatterns = [
    path('obtener_all', views.obtener_metodos_pago),
    path('obtener/<int:id>', views.obtener_metodo_pago_id),
    path('crear/', views.crear_metodo_pago),
    path('actualizar/', views.actualizar_metodo_pago),
]
