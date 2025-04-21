from django.urls import path
from categorias.views import crear_categoria,actualizar_categoria,obtener_categorias,obtener_categoria

urlpatterns=[
    path('registrar/',crear_categoria),
    path('actualizar/',actualizar_categoria),
    path('obtener_categoria/<int:id>',obtener_categoria),
    path('obtener_categorias',obtener_categorias)
]