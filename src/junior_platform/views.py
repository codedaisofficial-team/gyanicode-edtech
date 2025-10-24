from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .services.auth import AuthService


def junior_home(request):
    """Home page view"""
    return render(request, 'core/index.html')


def login_view(request):
    """Login view - handles both GET and POST requests"""
    if request.method == 'POST':
        # Process login through service
        result = AuthService.process_login_request(request)
        
        # Add message
        if result['success']:
            messages.success(request, result['message'])
            return redirect(result['redirect_to'])
        else:
            messages.error(request, result['message'])
    
    return render(request, 'core/auth/login.html')


def register_view(request):
    """Register view - handles both GET and POST requests"""
    if request.method == 'POST':
        # Process registration through service
        result = AuthService.process_registration_request(request)
        
        # Add messages
        if result['success']:
            messages.success(request, result['message'])
            return redirect(result['redirect_to'])
        else:
            # Display validation errors
            for field, error_message in result['errors'].items():
                messages.error(request, f'{field}: {error_message}')
    
    return render(request, 'core/auth/register.html')


@login_required
def dashboard_view(request):
    """Dashboard view - requires authentication"""
    return render(request, 'core/dashboard.html')


