from rest_framework.permissions import BasePermission

# Verifica si el usuario está autenticado y es ADMIN
class IsAdminUserCustom(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'ADMIN'
