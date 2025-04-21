# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

@api_view(['POST'])
def crear_producto(request):
    try:
        descripcion = request.data.get('descripcion')
        estado = request.data.get('estado')
        marca_id = request.data.get('marca_id')
        categoria_id = request.data.get('categoria_id')

        with connection.cursor() as cursor:
            cursor.execute("CALL crear_producto(%s, %s, %s, %s)", [descripcion, estado, marca_id, categoria_id])
        return Response({"detail": "Producto creado correctamente."}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def actualizar_producto(request):
    try:
        id = request.data.get('id')
        descripcion = request.data.get('descripcion')
        estado = request.data.get('estado')
        marca_id = request.data.get('marca_id')
        categoria_id = request.data.get('categoria_id')

        with connection.cursor() as cursor:
            cursor.execute("CALL actualizar_producto(%s, %s, %s, %s, %s)", [id, descripcion, estado, marca_id, categoria_id])
        return Response({"detail": "Producto actualizado correctamente."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_productos(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_productos()")
            columnas = [col[0] for col in cursor.description]
            datos = [dict(zip(columnas, row)) for row in cursor.fetchall()]
        return Response(datos, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_producto(request, id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_producto(%s)", [id])
            columnas = [col[0] for col in cursor.description]
            fila = cursor.fetchone()
            if fila:
                data = dict(zip(columnas, fila))
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_detalles_producto(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_detalles_producto()")
            columnas = [col[0] for col in cursor.description]
            resultados = [
                dict(zip(columnas, fila))
                for fila in cursor.fetchall()
            ]

        return Response(resultados, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def crear_completo_informacion(request):
    try:
        descripcion = request.data.get('descripcion')
        estado = request.data.get('estado')
        categoria_id = request.data.get('categoria_id')
        marca_id = request.data.get('marca_id')
        costo = request.data.get('costo')
        cantidad = request.data.get('cantidad')
        precio = request.data.get('precio')
        fecha_inicio = request.data.get('fecha_inicio')  # opcional
        fecha_final = request.data.get('fecha_final')    # opcional

        with connection.cursor() as cursor:
            cursor.execute("""
                CALL crear_producto_con_inventario_y_precio(%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, [
                descripcion,
                estado,
                categoria_id,
                marca_id,
                costo,
                cantidad,
                precio,
                fecha_inicio,
                fecha_final
            ])
        return Response({"detail": "Producto creado correctamente."}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def obtener_detalles_producto_categoria(request):
    try:
        # Obtener el parámetro 'categoria' desde la URL
        categoria = request.query_params.get('categoria', None)
        
        if not categoria:
            return Response({"detail": "El parámetro 'categoria' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Ejecutar la consulta en PostgreSQL
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_detalles_producto_categoria(%s)", [categoria])
            columnas = [col[0] for col in cursor.description]
            resultados = [
                dict(zip(columnas, fila))
                for fila in cursor.fetchall()
            ]

        return Response(resultados, status=status.HTTP_200_OK)
    
    except Exception as e:
        # Si ocurre un error, devolver el detalle
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def obtener_detalles_producto_marca(request):
    try:
        # Obtener el parámetro 'marca' de la URL
        marca = request.query_params.get('marca', None)

        # Verificar si se proporcionó la marca
        if not marca:
            return Response({"detail": "Falta el parámetro 'marca'"}, status=status.HTTP_400_BAD_REQUEST)

        # Ejecutar la función de PostgreSQL con el parámetro 'marca'
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_detalles_producto_marca(%s)", [marca])
            columnas = [col[0] for col in cursor.description]  # Obtener los nombres de las columnas
            resultados = [
                dict(zip(columnas, fila))  # Convertir cada fila a un diccionario
                for fila in cursor.fetchall()
            ]
        
        # Devolver los resultados en formato JSON
        return Response(resultados, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    

@api_view(['GET'])
def obtener_producto_por_nombre(request):
    nombre_producto = request.query_params.get('nombre', None)

    if not nombre_producto:
        return Response({"detail": "El parámetro 'nombre' es requerido."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_detalles_producto_nombre(%s)", [nombre_producto])
            columnas = [col[0] for col in cursor.description]
            fila = cursor.fetchone()

            if fila:
                resultado = dict(zip(columnas, fila))
                return Response(resultado, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    


@api_view(['POST'])
def actualizar_producto_completo(request):
    data = request.data

    campos_requeridos = [
        'nombre_producto', 'nueva_descripcion', 'nuevo_costo',
        'nueva_marca', 'nueva_categoria', 'nueva_cantidad', 'nuevo_precio'
    ]
    
    if not all(campo in data for campo in campos_requeridos):
        return Response({'detail': 'Faltan parámetros requeridos.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT actualizar_producto_por_nombre(%s, %s, %s, %s, %s, %s, %s)",
                [
                    data['nombre_producto'],
                    data['nueva_descripcion'],
                    data['nuevo_costo'],
                    data['nueva_marca'],
                    data['nueva_categoria'],
                    data['nueva_cantidad'],
                    data['nuevo_precio']
                ]
            )
        return Response({'detail': 'Producto actualizado correctamente'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def cambiar_estado_producto_por_id(request):
    data = request.data

    # Validar campos requeridos
    if 'producto_id' not in data or 'nuevo_estado' not in data:
        return Response(
            {'detail': 'Se requieren los campos "producto_id" y "nuevo_estado".'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT cambiar_estado_producto(%s, %s);",
                [data['producto_id'], data['nuevo_estado']]
            )
            mensaje = cursor.fetchone()[0]

        return Response({'detail': mensaje}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    
    
@api_view(['POST'])
def actualizar_cantidad_producto(request):
    data = request.data
    producto_id = data.get('producto_id')
    nueva_cantidad = data.get('nueva_cantidad')

    try:
        with connection.cursor() as cursor:
            # Aquí el cambio importante
            cursor.execute("CALL actualizar_cantidad_inventario(%s, %s)", [producto_id, nueva_cantidad])

        return Response({'mensaje': 'Cantidad actualizada correctamente'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)