from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

@api_view(['POST'])
def crear_categoria(request):
    nombre = request.data.get('nombre')
    try:
        with connection.cursor() as cursor:
            cursor.execute("CALL crear_categoria(%s)", [nombre])
        return Response({"detail": "Categoría creada correctamente."}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def actualizar_categoria(request):
    id = request.data.get('id')
    nombre = request.data.get('nombre')
    try:
        with connection.cursor() as cursor:
            cursor.execute("CALL actualizar_categoria(%s, %s)", [id, nombre])
        return Response({"detail": "Categoría actualizada correctamente."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_categorias(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_categorias()")
            columnas = [col[0] for col in cursor.description]
            datos = [dict(zip(columnas, row)) for row in cursor.fetchall()]
        return Response(datos, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_categoria(request):
    categoria=request.GET.get('categoria_id')
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_categoria(%s)", [categoria])
            columnas = [col[0] for col in cursor.description]
            fila = cursor.fetchone()
            if fila:
                data = dict(zip(columnas, fila))
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Categoría no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
