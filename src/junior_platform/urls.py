# junior/urls.py
from django.urls import path
from . import views  # 👈 Correct import

urlpatterns = [
    path('', views.junior_home, name='junior_home'),
    path('login/', views.login_view, name='login_view'),
    path('register/', views.register_view, name='register_view'),
    path('dashboard/', views.dashboard_view, name='dashboard_view'),
]
