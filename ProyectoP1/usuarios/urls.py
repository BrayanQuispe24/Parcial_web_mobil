from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, UserAdminViewSet,AllUsersView,UpdateUserView,DeleteUserView,UpdateUserViewOnlyAdmin,AdminCreateUserView,get_user_by_email

# Creamos el router para el admin
router = DefaultRouter()
router.register(r'admin/users', UserAdminViewSet, basename='admin-users')

urlpatterns = [
    path('register/', RegisterView.as_view()),  # Registro público
    path('registerByAdmin/', AdminCreateUserView.as_view()),
    path('login/', LoginView.as_view()),
    path('usuarios', AllUsersView.as_view(),name='listar-usuarios'),
    path('user/update/<int:pk>/', UpdateUserView.as_view(), name='update-user'),
    path('user/delete/<int:pk>/', DeleteUserView.as_view(), name='delete-user'),
    path('admin/update/<int:pk>/', UpdateUserViewOnlyAdmin.as_view(), name='update-user'),
    path('usuarios/buscar',get_user_by_email),
    # Login y obtención de token
    path('', include(router.urls)),             # CRUD para admin de usuarios
]
