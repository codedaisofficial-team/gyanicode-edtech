"""
Authentication service for handling user registration and authentication logic
"""
from django.contrib.auth import authenticate, login
from django.core.exceptions import ValidationError
from django.db import transaction
from ..models.auth import User


class AuthService:
    """Service class for authentication operations"""
    
    @staticmethod
    def process_login_request(request):
        """
        Process login request from view
        
        Args:
            request: Django request object
            
        Returns:
            dict: {
                'success': bool,
                'message': str,
                'redirect_to': str,
                'status_code': int
            }
        """
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '')
        
        # Validate inputs
        if not email:
            return {
                'success': False,
                'message': 'Email is required',
                'redirect_to': None,
                'status_code': 400
            }
        
        if not password:
            return {
                'success': False,
                'message': 'Password is required',
                'redirect_to': None,
                'status_code': 400
            }
        
        # Authenticate user
        user = authenticate(username=email, password=password)
        
        if user:
            login(request, user)
            return {
                'success': True,
                'message': f'Welcome back, {user.get_full_name()}!',
                'redirect_to': 'junior_home',
                'status_code': 200
            }
        else:
            return {
                'success': False,
                'message': 'Invalid email or password. Please try again.',
                'redirect_to': None,
                'status_code': 401
            }
    
    @staticmethod
    def process_registration_request(request):
        """
        Process registration request from view
        
        Args:
            request: Django request object
            
        Returns:
            dict: {
                'success': bool,
                'message': str,
                'errors': dict,
                'redirect_to': str,
                'status_code': int
            }
        """
        # Extract and clean form data
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()
        
        form_data = {
            'name': name,
            'email': email,
            'password': password,
        }
        
        # Register user
        success, result = AuthService.register_user(form_data)
        
        if success:
            user = result
            return {
                'success': True,
                'message': f'Account created successfully! Welcome, {user.get_full_name()}',
                'errors': {},
                'redirect_to': 'login_view',
                'status_code': 201
            }
        else:
            return {
                'success': False,
                'message': 'Registration failed',
                'errors': result,
                'redirect_to': None,
                'status_code': 400
            }
    
    @staticmethod
    def validate_registration_data(data):
        """
        Validate registration form data
        
        Args:
            data: Dictionary containing form data
            
        Returns:
            tuple: (is_valid, errors_dict)
        """
        errors = {}
        
        # Validate email
        email = data.get('email', '').strip()
        if not email:
            errors['email'] = 'Email is required'
        elif not email or '@' not in email:
            errors['email'] = 'Please enter a valid email address'
        elif User.objects.filter(email=email).exists():
            errors['email'] = 'This email is already registered'
        
        # Validate full name
        full_name = data.get('name', '').strip()
        if not full_name:
            errors['name'] = 'Full name is required'
        elif len(full_name) < 3:
            errors['name'] = 'Name must be at least 3 characters long'
        elif len(full_name) > 150:
            errors['name'] = 'Name must be less than 150 characters'
        
        # Validate password
        password = data.get('password', '').strip()
        if not password:
            errors['password'] = 'Password is required'
        elif len(password) < 8:
            errors['password'] = 'Password must be at least 8 characters long'
        elif not any(char.isupper() for char in password):
            errors['password'] = 'Password must contain at least one uppercase letter'
        elif not any(char.isdigit() for char in password):
            errors['password'] = 'Password must contain at least one number'
        elif not any(char in '!@#$%^&*()_+-=[]{};\':"\\|,.<>/?`~' for char in password):
            errors['password'] = 'Password must contain at least one special character'
        
        return len(errors) == 0, errors
    
    @staticmethod
    @transaction.atomic
    def register_user(data):
        """
        Register a new user
        
        Args:
            data: Dictionary containing user registration data
            
        Returns:
            tuple: (success, user_or_errors)
                    success: Boolean indicating if registration was successful
                    user_or_errors: User object if successful, error dict if failed
        """
        # Validate the data
        is_valid, errors = AuthService.validate_registration_data(data)
        
        if not is_valid:
            return False, errors
        
        try:
            # Create the user
            user = User.objects.create_user(
                email=data.get('email').strip().lower(),
                full_name=data.get('name').strip(),
                password=data.get('password'),
            )
            
            return True, user
            
        except Exception as e:
            return False, {'general': f'An error occurred during registration: {str(e)}'}
    
    @staticmethod
    def authenticate_user(email, password):
        """
        Authenticate a user
        
        Args:
            email: User's email
            password: User's password
            
        Returns:
            User object if authenticated, None otherwise
        """
        user = authenticate(username=email, password=password)
        return user
    
    @staticmethod
    def check_email_exists(email):
        """
        Check if an email already exists
        
        Args:
            email: Email to check
            
        Returns:
            Boolean indicating if email exists
        """
        return User.objects.filter(email=email.lower()).exists()
    
    @staticmethod
    def get_user_by_email(email):
        """
        Get user by email
        
        Args:
            email: User's email
            
        Returns:
            User object or None
        """
        try:
            return User.objects.get(email=email.lower())
        except User.DoesNotExist:
            return None

