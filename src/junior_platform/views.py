from django.contrib.auth.decorators import login_required
from .services.auth import AuthService


def junior_home(request):
    """Home page view"""
    return AuthService.handle_home_view(request)


def login_view(request):
    """Login page"""
    return AuthService.handle_login_view(request)


def register_view(request):
    """Register page"""
    return AuthService.handle_register_view(request)


def verify_otp_view(request):
    return AuthService.handle_verify_otp_view(request)

def resend_otp_view(request):
    return AuthService.handle_resend_otp_view(request)


@login_required
def dashboard_view(request):
    """Dashboard page"""
    return AuthService.handle_dashboard_view(request)


def logout_view(request):
    """Logout view"""
    return AuthService.handle_logout_view(request)
