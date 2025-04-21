from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from datetime import datetime


from datetime import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.http import JsonResponse

@api_view(['POST'])
def crear_personal(request):
    data = request.data

    # Obtener los datos del formulario
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    telefono = data.get('telefono')
    direccion = data.get('direccion')
    fecha_nacimiento = datetime.strptime(data.get('fecha_nacimiento'), "%Y-%m-%d").date()
    rol = data.get('rol')
    correo_electronico = data.get('correo_electronico')

    try:
        # Llamar al procedimiento almacenado para crear el personal
        with connection.cursor() as cursor:
            cursor.execute("CALL crear_personal(%s, %s, %s, %s, %s, %s, %s)", [
                nombre, 
                apellido, 
                telefono, 
                direccion, 
                fecha_nacimiento, 
                rol, 
                correo_electronico
            ])
        
        # Si todo sale bien, retornar un mensaje de éxito
        return JsonResponse({'mensaje': 'Personal creado con éxito'}, status=201)

    except Exception as e:
        # Si ocurre un error, retornar el error
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['PUT'])
def actualizar_personal(request):
    data = request.data
    try:
        with connection.cursor() as cursor:
            cursor.callproc('actualizar_personal', [
                data['id'],
                data['nombre'],
                data['apellido'],
                data['telefono'],
                data['direccion'],
                data['fecha_nacimiento'],
                data['rol'],
                data['usuario_id']
            ])
        return Response({'mensaje': 'Personal actualizado con éxito'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def obtener_personal(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_personal()")
            columnas = [col[0] for col in cursor.description]
            datos = [dict(zip(columnas, fila)) for fila in cursor.fetchall()]
        return Response(datos, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_personal_id(request, id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_personal_id(%s)", [id])
            columnas = [col[0] for col in cursor.description]
            datos = [dict(zip(columnas, fila)) for fila in cursor.fetchall()]
        return Response(datos, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
