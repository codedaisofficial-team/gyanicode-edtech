from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import RegexValidator
from django.contrib.auth.models import PermissionsMixin

class UserManager(BaseUserManager):
    """Custom user manager for User model"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user"""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)




class User(AbstractBaseUser, PermissionsMixin):

    """Custom User model for Junior Platform"""
    
    # Basic Information
    email = models.EmailField(
        max_length=255,
        unique=True,
        db_index=True,
        verbose_name='Email Address'
    )
    full_name = models.CharField(
        max_length=150,
        verbose_name='Full Name'
    )
    
    # Contact Information
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True,
        null=True,
        verbose_name='Phone Number'
    )
    
    # Status and Permissions
    is_active = models.BooleanField(
        default=True,
        verbose_name='Active'
    )
    is_staff = models.BooleanField(
        default=False,
        verbose_name='Staff Status'
    )
    is_superuser = models.BooleanField(
        default=False,
        verbose_name='Superuser Status'
    )
    
    # Timestamps
    date_joined = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Date Joined'
    )
    last_login = models.DateTimeField(
        auto_now=True,
        verbose_name='Last Login'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Updated At'
    )
    
    # Additional Fields
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        verbose_name='Profile Picture'
    )
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """Return the full name"""
        return self.full_name
    
    def get_short_name(self):
        """Return the short name"""
        return self.full_name.split()[0] if self.full_name else ''
    
    def has_perm(self, perm, obj=None):
        """Check if user has specific permission"""
        return self.is_superuser
    
    def has_module_perms(self, app_label):
        """Check if user has permissions for the app"""
        return self.is_superuser


