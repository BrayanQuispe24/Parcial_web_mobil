from django.urls import path
from . import views

urlpatterns = [
    path('obtener_personal_all', views.obtener_personal),
    path('obtener/<int:id>', views.obtener_personal_id),
    path('crear/', views.crear_personal),
    path('actualizar/', views.actualizar_personal),
]
