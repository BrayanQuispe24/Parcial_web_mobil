from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

# Create your views here.
@api_view(['POST'])
def insertar_imagen(request):
    data = request.data
    try:
        with connection.cursor() as cursor:
            cursor.callproc('insertar_imagen', [
                data['url'],
                data['producto_id']
            ])
        return Response({'mensaje': 'Imagen insertada con éxito'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def obtener_imagen_por_id(request, id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_imagen_por_id(%s);", [id])
            row = cursor.fetchone()
            if row:
                imagen = {
                    'id': row[0],
                    'url': row[1],
                    'producto_id': row[2]
                }
                return Response(imagen)
            else:
                return Response({'mensaje': 'Imagen no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def obtener_todas_las_imagenes(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_todas_las_imagenes();")
            rows = cursor.fetchall()
            imagenes = []
            for row in rows:
                imagenes.append({
                    'id': row[0],
                    'url': row[1],
                    'producto_id': row[2]
                })
            return Response(imagenes)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

