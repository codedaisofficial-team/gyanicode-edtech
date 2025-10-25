# junior/urls.py
from django.urls import path
from . import views  # 👈 Correct import

urlpatterns = [
    path('', views.junior_home, name='junior_home'),
    path('', views.junior_home, name='home_view'),  # Alias for home
    path('login/', views.login_view, name='login_view'),
    path('register/', views.register_view, name='register_view'),
    path('verify-otp/', views.verify_otp_view, name='verify_otp_view'),
    path('resend-otp/', views.resend_otp_view, name='resend_otp'),
    path('dashboard/', views.dashboard_view, name='dashboard_view'),
    path('logout/', views.logout_view, name='logout_view'),
]
