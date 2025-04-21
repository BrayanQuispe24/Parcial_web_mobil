from django.shortcuts import render
from rest_framework.decorators import api_view
from django.db import connection
from rest_framework import status
from rest_framework.response import Response
# Create your views here.
@api_view(['POST'])
def registrar_permiso(request):
    crear=request.data.get('crear')
    eliminar=request.data.get('eliminar')
    actualizar=request.data.get('actualizar')
    ver=request.data.get('ver')
    usuario_id=request.data.get('usuario_id')
    
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "CALL registrar_permisos(%s,%s,%s,%s,%s)",
                [crear,eliminar,actualizar,ver,usuario_id]
            )
    except Exception as e:
        return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({'mensaje':'el permiso se agrego correctamente'},status=status.HTTP_201_CREATED)
#modificar que solo devuelva 1
@api_view(['GET'])
def obtener_permiso(request):
    usuario_id=request.GET.get('usuario_id')
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_permiso(%s)",[usuario_id])
            columnas=[col[0] for col in cursor.description]
            datos=[dict(zip(columnas,row)) for row in cursor.fetchall()]
        return Response(datos,status=status.HTTP_200_OK)
    except Exception as e:
            error_message = str(e)
            return Response(
               {"detail": f"Error al obtener los usuarios: {error_message}"},
               status=status.HTTP_500_INTERNAL_SERVER_ERROR  # Error interno del servidor si algo falla
        )

@api_view(['PUT'])
def actualizar_permiso(request):
    try:
        crear=request.data.get('crear')
        eliminar=request.data.get('eliminar')
        actualizar=request.data.get('actualizar')
        ver=request.data.get('ver')
        usuario=request.data.get('usuario_id')
        
        with connection.cursor() as cursor:
            cursor.execute("CALL actualizar_permiso(%s,%s,%s,%s,%s);",[crear,eliminar,actualizar,ver,usuario])
        
        return Response({"mensaje":"permiso actualizado correctamente."},status=status.HTTP_200_OK)
    
    except Exception as e:
        error_message=str(e)    
        return Response(
            {"detail": f"Error al actualizar el permiso: {error_message}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        

@api_view(['GET'])
def obtener_ultimo_permiso_por_email(request):
    email = request.GET.get('email')

    if not email:
        return Response({"error": "El parámetro 'email' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_ultimo_permiso_por_email(%s)", [email])
            columnas = [col[0] for col in cursor.description]
            fila = cursor.fetchone()

            if fila is None:
                return Response({"detalle": "No se encontró permiso para este correo electrónico."}, status=status.HTTP_404_NOT_FOUND)

            datos = dict(zip(columnas, fila))

        return Response(datos, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"detail": f"Error al obtener el permiso: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def verificar_permiso_por_id(request):
    usuario_id = request.GET.get('usuario_id')

    if not usuario_id:
        return Response({'error': 'El parámetro permiso_id es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT verificar_existencia_permiso(%s);", [usuario_id])
            resultado = cursor.fetchone()[0]  # devuelve True o False
        return Response({'existe': resultado}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': f'Ocurrió un error al verificar el permiso: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

                      