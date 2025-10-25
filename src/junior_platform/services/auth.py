import random
import threading
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.db import transaction
from ..models.auth import User
from django.http import JsonResponse
from django.core.mail import send_mail


class AuthService:
    """Handles authentication, registration, and OTP verification using session and background email sending."""

    # =========================================================
    # VIEW HANDLERS
    # =========================================================
    @staticmethod
    def handle_home_view(request):
        # Display welcome message after login redirect (optimized - no DB query)
        if request.session.pop('login_success', False):
            if request.user.is_authenticated:
                # Use cached full_name from user object instead of DB query
                user_name = request.user.full_name if hasattr(request.user, 'full_name') else 'User'
                messages.success(request, f"Welcome back, {user_name}!")
        return render(request, 'core/index.html')

    @staticmethod
    def handle_dashboard_view(request):
        return render(request, 'core/dashboard.html')

    @staticmethod
    def handle_logout_view(request):
        """Handle user logout"""
        logout(request)
        messages.success(request, "You have been successfully logged out.")
        return redirect('home_view')

    @staticmethod
    def handle_login_view(request):
        if request.method == 'POST':
            result = AuthService.process_login_request(request)
            if result['success']:
                # Store message in session for display after redirect (faster)
                request.session['login_success'] = True
                return redirect(result['redirect_to'])
            else:
                messages.error(request, result['message'])
        return render(request, 'core/auth/login.html')

    # =========================================================
    # 🟡 REGISTER + OTP STEP 1
    # =========================================================
    @staticmethod
    def handle_register_view(request):
        """Handles user registration and OTP generation."""
        if request.method == 'POST':
            data = {
                'name': request.POST.get('name', '').strip(),
                'email': request.POST.get('email', '').strip().lower(),
                'password': request.POST.get('password', '').strip(),
            }

            # ✅ Step 1: Validate registration data
            is_valid, errors = AuthService.validate_registration_data(data)
            if not is_valid:
                for field, msg in errors.items():
                    messages.error(request, f"{field}: {msg}")
                return render(request, 'core/auth/register.html')

            # ✅ Step 2: Generate OTP and store in session
            otp = AuthService.generate_otp()
            request.session['otp_data'] = {
                'otp': otp,
                'data': data,  # includes name, email, password
            }
            request.session['email_for_otp'] = data['email']
            request.session.set_expiry(300)  # 5 minutes

            # ✅ Step 3: Send OTP asynchronously
            def send_otp_email():
                subject = 'Your OTP for Gyanicode EdTech Registration'
                message = (
                    f"Hello {data['name']},\n\n"
                    f"Your One-Time Password (OTP) for registration is: {otp}\n\n"
                    f"It will expire in 5 minutes."
                )
                try:
                    send_mail(subject, message, None, [data['email']])
                    print(f"✅ OTP sent to {data['email']}")
                except Exception as e:
                    print(f"❌ Failed to send OTP to {data['email']}: {e}")

            threading.Thread(target=send_otp_email).start()

            messages.info(request, f"An OTP has been sent to {data['email']}")
            return render(request, 'core/auth/verify_otp.html', {'email': data['email']})

        return render(request, 'core/auth/register.html')

    # =========================================================
    # 🟢 VERIFY OTP + SAVE USER (no revalidation)
    # =========================================================

    @staticmethod
    def handle_verify_otp_view(request):
        if request.method == 'POST':
            user_otp = request.POST.get('otp', '').strip()
            otp_data = request.session.get('otp_data')
            if not otp_data:
                messages.error(request, "OTP expired or invalid. Please register again.")
                return redirect('register_view')

            stored_otp = otp_data.get('otp')
            data = otp_data.get('data', {})

            if user_otp != stored_otp:
                messages.error(request, "Invalid OTP. Please try again.")
                return render(request, 'core/auth/verify_otp.html', {'email': data.get('email', '')})

            # ✅ Use data directly from session
            name = data['name']
            email = data['email']
            password = data['password']

            success, _ = AuthService.register_user({
                'name': name,
                'email': email,
                'password': password
            })

            request.session.pop('otp_data', None)
            request.session.pop('email_for_otp', None)

            if success:
                messages.success(request, "Registration successful! Please log in.")
                return redirect('login_view')

            messages.error(request, "Registration failed. Please try again.")
            return redirect('register_view')

        return redirect('register_view')

    # =========================================================
    # RESEND OTP
    # =========================================================
    @staticmethod
    def handle_resend_otp_view(request):
        email = request.GET.get('email') or request.session.get('email_for_otp')

        if not email:
            return JsonResponse({'error': 'Email missing'}, status=400)

        otp_data = request.session.get('otp_data')
        if not otp_data:
            return JsonResponse({'error': 'OTP session expired. Please re-register.'}, status=400)

        data = otp_data.get('data')
        otp = AuthService.generate_otp()

        # Update OTP in session
        request.session['otp_data'] = {'otp': otp, 'data': data}
        request.session.set_expiry(300)

        # Send OTP email in background
        def send_otp_email():
            subject = 'Your OTP for Gyanicode EdTech Registration (Resent)'
            message = (
                f"Hello {data['name']},\n\n"
                f"Your new OTP is: {otp}\n\n"
                f"It will expire in 5 minutes."
            )
            try:
                send_mail(subject, message, None, [email])
                print(f"✅ Resent OTP sent to {email}")
            except Exception as e:
                print(f"❌ Failed to resend OTP to {email}: {e}")

        threading.Thread(target=send_otp_email).start()

        return JsonResponse({'message': 'OTP resent successfully'}, status=200)

    # =========================================================
    # LOGIN LOGIC
    # =========================================================
    @staticmethod
    def process_login_request(request):
        email = request.POST.get('email', '').strip().lower()
        password = request.POST.get('password', '')

        if not email:
            return AuthService._error("Email is required")
        if not password:
            return AuthService._error("Password is required")

        user = authenticate(username=email, password=password)
        if not user:
            return AuthService._error("Invalid email or password")

        login(request, user)
        # Removed get_full_name() call to avoid extra DB query during redirect
        return AuthService._success("Login successful!", redirect_to='junior_home')

    # =========================================================
    # USER CREATION
    # =========================================================
    @staticmethod
    @transaction.atomic
    def register_user(data):
        """Creates a new user account."""
        try:
            user = User.objects.create_user(
                email=data['email'],
                full_name=data['name'],
                password=data['password']
            )
            return True, user
        except Exception as e:
            print("❌ User creation failed:", e)
            return False, {'general': str(e)}

    # =========================================================
    # VALIDATION + UTILITIES
    # =========================================================
    @staticmethod
    def validate_registration_data(data):
        """Basic data validation (called only once during registration)."""
        errors = {}
        email, name, password = data.get('email'), data.get('name'), data.get('password')

        if not email:
            errors['email'] = 'Email is required'
        elif '@' not in email:
            errors['email'] = 'Enter a valid email address'
        elif User.objects.filter(email=email).exists():
            errors['email'] = 'This email is already registered'

        if not name:
            errors['name'] = 'Full name is required'
        elif len(name) < 3:
            errors['name'] = 'Name must be at least 3 characters long'

        if not password:
            errors['password'] = 'Password is required'
        elif len(password) < 8:
            errors['password'] = 'Password must be at least 8 characters long'

        return len(errors) == 0, errors

    @staticmethod
    def generate_otp():
        """Generates a random 6-digit OTP."""
        return str(random.randint(100000, 999999))

    # =========================================================
    # RESPONSE HELPERS
    # =========================================================
    @staticmethod
    def _success(message, redirect_to=None, status=200):
        return {'success': True, 'message': message, 'redirect_to': redirect_to, 'status_code': status}

    @staticmethod
    def _error(message, status=400):
        return {'success': False, 'message': message, 'redirect_to': None, 'status_code': status}
