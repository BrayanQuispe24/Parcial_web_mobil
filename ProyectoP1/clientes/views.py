from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from clientes.models import Cliente
from rest_framework import status
from rest_framework.response import Response
from django.db import connection 
# Create your views here.
@api_view(['POST'])
def registrar_cliente(request):
    nombre=request.data.get('nombre')
    apellido=request.data.get('apellido')
    telefono=request.data.get('telefono')
    direccion=request.data.get('direccion')
    estado=request.data.get('estado')
    usuario=request.data.get('usuario_id')
    
    if Cliente.objects.filter(nombre=nombre, apellido=apellido).exists():
         return Response({'error': 'El Cliente ya existe'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "CALL registrar_cliente(%s,%s,%s,%s,%s,%s)",
                [nombre,apellido,telefono,direccion,estado,usuario]
            ) 
    except Exception as e:
        return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({'mensaje':'cliente agregado con exito'},status=status.HTTP_200_OK)
#---------------------------------------------------------------------------------------------

@api_view(['GET']) 
def obtener_clientes(request):
    try:
        #realizamos una consulta a la funcion PostgreSql
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM obtener_usuarios();")
            columns=[col[0] for col in cursor.description]
            results=[dict(zip(columns,row)) for row in cursor.fetchall()]
        return Response(results,status=status.HTTP_200_OK)
    except Exception as e:
            error_message = str(e)
            return Response(
               {"detail": f"Error al obtener los usuarios: {error_message}"},
               status=status.HTTP_500_INTERNAL_SERVER_ERROR  # Error interno del servidor si algo falla
        )
#---------------------------------------------------------------------------------------------
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from rest_framework import status

@api_view(['PUT'])
def actualizar_cliente(request):
    try:
        # Obtener los datos del cliente del request
        cliente_id = request.data.get('id')
        nombre = request.data.get('nombre')
        apellido = request.data.get('apellido')
        telefono = request.data.get('telefono')
        direccion = request.data.get('direccion')
        estado=request.data.get('estado')
        usuario_id = request.data.get('usuario_id')
        
        # Ejecutar el procedimiento almacenado
        with connection.cursor() as cursor:
            cursor.execute("""
                CALL actualizar_cliente(%s, %s, %s, %s, %s, %s,%s);
            """, [cliente_id, nombre, apellido, telefono, direccion,estado, usuario_id])
        
        # Retornar una respuesta exitosa
        return Response({"detail": "Cliente actualizado correctamente."}, status=status.HTTP_200_OK)
    
    except Exception as e:
        # Manejo de errores
        error_message = str(e)
        return Response(
            {"detail": f"Error al actualizar el cliente: {error_message}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
            
        
        