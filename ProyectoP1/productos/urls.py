# urls.py
from django.urls import path
from .views import (crear_producto, actualizar_producto, obtener_productos, obtener_producto,obtener_detalles_producto,crear_completo_informacion,
                    obtener_detalles_producto_categoria,obtener_detalles_producto_marca,obtener_producto_por_nombre,actualizar_producto_completo,
                    cambiar_estado_producto_por_id,actualizar_cantidad_producto)

urlpatterns = [
    path('crear/', crear_producto),
    path('actualizar/', actualizar_producto),
    path('producto', obtener_productos),
    path('producto/<int:id>', obtener_producto),
    path('producto_with_information/',obtener_detalles_producto),
    path('crear_completo/', crear_completo_informacion),
    path('productos_by_categoria',obtener_detalles_producto_categoria),
    path('productos_by_marca',obtener_detalles_producto_marca),
    path('producto_by_nombre',obtener_producto_por_nombre),
    path('actualizar_producto_completo/',actualizar_producto_completo),
    path('cambiar_estado/',cambiar_estado_producto_por_id),
    path('actualizar_cantidad/',actualizar_cantidad_producto)
]
