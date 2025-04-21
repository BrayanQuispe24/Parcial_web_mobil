from django.urls import path
from clientes.views import registrar_cliente,obtener_clientes,actualizar_cliente

urlpatterns=[
    path('registrar/',registrar_cliente),
    path('obtener_clientes',obtener_clientes),
    path('actualizar_cliente/',actualizar_cliente)
]
#falta implementar seguridades