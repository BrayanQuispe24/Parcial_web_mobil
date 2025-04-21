from django.shortcuts import render
# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

@api_view(['POST'])
def crear_marca(request):
    nombre = request.data.get('nombre')
    estado = request.data.get('estado')
    try:
        with connection.cursor() as cursor:
            cursor.execute("CALL crear_marca(%s, %s)", [nombre, estado])
        return Response({"detail": "Marca creada correctamente."}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def actualizar_marca(request):
    id = request.data.get('id')
    nombre = request.data.get('nombre')
    estado = request.data.get('estado')
    try:
        with connection.cursor() as cursor:
            cursor.execute("CALL actualizar_marca(%s, %s, %s)", [id, nombre, estado])
        return Response({"detail": "Marca actualizada correctamente."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_marcas(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_marcas()")
            columnas = [col[0] for col in cursor.description]
            datos = [dict(zip(columnas, row)) for row in cursor.fetchall()]
        return Response(datos, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_marca(request, id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_marca(%s)", [id])
            columnas = [col[0] for col in cursor.description]
            fila = cursor.fetchone()
            if fila:
                data = dict(zip(columnas, fila))
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Marca no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
