from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

@api_view(['POST'])
def crear_inventario(request):
    data = request.data
    try:
        with connection.cursor() as cursor:
            cursor.callproc('crear_inventario', [
                data['costo'],
                data['cantidad'],
                data['producto_id']
            ])
        return Response({'mensaje': 'Inventario creado con éxito'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def actualizar_inventario(request):
    data = request.data
    try:
        with connection.cursor() as cursor:
            cursor.callproc('actualizar_inventario', [
                data['id'],
                data['costo'],
                data['cantidad'],
                data['producto_id']
            ])
        return Response({'mensaje': 'Inventario actualizado con éxito'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def obtener_inventario(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_inventario()")
            columnas = [col[0] for col in cursor.description]
            datos = [dict(zip(columnas, fila)) for fila in cursor.fetchall()]
        return Response(datos, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_inventario_id(request, id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_inventario_id(%s)", [id])
            columnas = [col[0] for col in cursor.description]
            datos = [dict(zip(columnas, fila)) for fila in cursor.fetchall()]
        return Response(datos, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
