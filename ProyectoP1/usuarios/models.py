from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.
# El CustomUserManager se encarga de crear usuarios personalizados con funcionalidades extendidas
class CustomUserManager(BaseUserManager):
    
    #metodo para crear un usuario normal
    def create_user(self,email,password=None,role='client', **extra_fields):
        #si no se proporciona un email lanza un error 
        if not email:
            raise ValueError('El email es obligatorio')
        #Normaliza el email (convierte a minúsculas y asegura el formato correcto)
        
        email=self.normalize_email(email)
        
        # Crea una instancia del usuario con los campos proporcionados, como email, role y otros campos adicionales
        user = self.model(email=email, role=role, **extra_fields)
        
        # Asigna la contraseña al usuario de manera segura
        user.set_password(password)#encripta la contrasenia 
        
        # Guarda el usuario en la base de datos usando la conexión de base de datos definida en el manager
        user.save(using=self._db)
        
        # Devuelve el usuario creado
        return user
    
    #metodo para crear un superusuario
    def create_superuser(self, email, password=None, **extra_fields):
        #asegura que el usuario tenga permisos de staff y superusuarios
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        
        #Llama al metodo create_user para crear el superusuario con un rol de 'Admin'
        return self.create_user(email,password, role='ADMIN', **extra_fields)
class CustomUser(AbstractBaseUser,PermissionsMixin):
    
    #definimos las opciones posibles para el campo role
    ROLE_CHOICES=(
        ('ADMIN', 'Administrador'),  # Rol para administradores
        ('SELLER', 'Vendedor'),     # Rol para vendedores
        ('CLIENT', 'Cliente'),      # Rol para clientes
    )
    # El campo 'email' será único en la base de datos (solo se puede registrar un usuario con un email único)
    email = models.EmailField(unique=True)
    # Define un campo 'first_name' para el nombre del usuario
    first_name = models.CharField(max_length=30)   
    # Define un campo 'role' con las opciones definidas en ROLE_CHOICES, y establece 'CLIENT' como valor predeterminado
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='CLIENT')
    # Indica si el usuario está activo o no
    is_active = models.BooleanField(default=True)
    # Indica si el usuario tiene privilegios de personal (solo se establece a True en el caso de los superusuarios)
    is_staff = models.BooleanField(default=False)
    # Establece el campo 'email' como el campo de autenticación principal en lugar de 'username'
    USERNAME_FIELD = 'email'
    # Define los campos que son requeridos además del 'email' (en este caso 'first_name')
    REQUIRED_FIELDS = ['first_name']
    # Asigna el CustomUserManager como el manager para este modelo
    objects = CustomUserManager()
     # Define la representación en cadena (cuando se imprime el usuario, muestra el email y el rol)
    def __str__(self):
        return f"{self.email} ({self.role})"
    
    