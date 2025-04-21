from django.urls import path 
from permisos.views import registrar_permiso,obtener_permiso,actualizar_permiso,obtener_ultimo_permiso_por_email,verificar_permiso_por_id

urlpatterns=[
    path('registrar/',registrar_permiso),
    path('obtener',obtener_permiso),
    path('actualizar/',actualizar_permiso),
    path('obtener_by_email',obtener_ultimo_permiso_por_email),
    path('existePermisos',verificar_permiso_por_id)
]