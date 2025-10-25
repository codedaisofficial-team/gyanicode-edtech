
// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    // Check URL parameter to determine login type
    const urlParams = new URLSearchParams(window.location.search);
    const isDashboard = urlParams.get('dashboard') === 'true';

    if (isDashboard) {
        showDashboardLogin();
    } else {
        showRegularLogin();
    }

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';

    // Auto-remove alerts after 5 seconds
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            alert.remove();
        });
    }, 5000);
});

// Toggle password visibility for regular login
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = document.querySelector('#regular-login .password-toggle');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Toggle password visibility for dashboard login
function toggleDashboardPassword() {
    const passwordInput = document.getElementById('dashboard_password');
    const icon = document.querySelector('#dashboard-login .password-toggle');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show regular login form
function showRegularLogin() {
    document.getElementById('regular-login').style.display = 'block';
    document.getElementById('dashboard-login').style.display = 'none';
    document.getElementById('login-title').textContent = 'Welcome Back';
    document.getElementById('login-subtitle').textContent = 'Sign in to continue your learning journey';
}

// Show dashboard login form
function showDashboardLogin() {
    document.getElementById('regular-login').style.display = 'none';
    document.getElementById('dashboard-login').style.display = 'block';
    document.getElementById('login-title').textContent = 'Student Dashboard';
    document.getElementById('login-subtitle').textContent = 'Enter your student credentials';
}

// Social login function
function socialLogin(provider) {
    // In a real implementation, this would redirect to the OAuth provider
    alert(`Redirecting to ${provider} authentication...`);
}

// Handle window resize
window.addEventListener('resize', function () {
    document.body.style.overflow = 'hidden';
});



    // Toggle password visibility
    function togglePassword() {
        const passwordInput = document.getElementById('password');
        const icon = document.querySelector('.password-toggle');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    // Auto-remove toasts after 5 seconds
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(() => {
            const toasts = document.querySelectorAll('.tst');
            toasts.forEach(toast => {
                toast.remove();
            });
        }, 5000);

        // Initialize form validation
        initializeValidation();
    });

    // Form validation with automatic button enable
    function initializeValidation() {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const registerBtn = document.getElementById('register-btn');
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');
        const passwordStrengthBar = document.getElementById('password-strength-bar');

        // Track validation states for each field
        const validationStates = {
            name: false,
            email: false,
            password: false
        };

        // Name validation
        function validateName() {
            const name = nameInput.value.trim();
            if (name.length < 3) {
                nameError.textContent = "Name must be at least 3 characters long.";
                nameInput.classList.add('error');
                nameInput.classList.remove('success');
                validationStates.name = false;
                return false;
            } else {
                nameError.textContent = "";
                nameInput.classList.remove('error');
                nameInput.classList.add('success');
                validationStates.name = true;
                return true;
            }
        }

        // Email validation
        function validateEmail() {
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailError.textContent = "Please enter a valid email address.";
                emailInput.classList.add('error');
                emailInput.classList.remove('success');
                validationStates.email = false;
                return false;
            } else {
                emailError.textContent = "";
                emailInput.classList.remove('error');
                emailInput.classList.add('success');
                validationStates.email = true;
                return true;
            }
        }

        // Password strength calculation
        function checkPasswordStrength(password) {
            let strength = 0;

            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

            return strength;
        }

        // Update password strength visual
        function updatePasswordStrength(password) {
            const strength = checkPasswordStrength(password);
            passwordStrengthBar.className = 'strength-bar';

            if (password.length === 0) {
                passwordStrengthBar.style.width = '0%';
            } else if (strength <= 2) {
                passwordStrengthBar.classList.add('strength-weak');
            } else if (strength === 3) {
                passwordStrengthBar.classList.add('strength-medium');
            } else {
                passwordStrengthBar.classList.add('strength-strong');
            }
        }

        // Password validation
        function validatePassword() {
            const password = passwordInput.value.trim();
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

            if (!passwordRegex.test(password)) {
                passwordError.textContent = "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 number, and 1 special character.";
                passwordInput.classList.add('error');
                passwordInput.classList.remove('success');
                validationStates.password = false;
                return false;
            } else {
                passwordError.textContent = "";
                passwordInput.classList.remove('error');
                passwordInput.classList.add('success');
                validationStates.password = true;
                return true;
            }
        }

        // Enable or disable the register button
        function enableDisableButton() {
            const allValid = validationStates.name && validationStates.email && validationStates.password;
            registerBtn.disabled = !allValid;

            // Force UI update
            registerBtn.style.opacity = allValid ? '1' : '0.6';
        }

        // Event listeners for real-time validation
        nameInput.addEventListener('input', function () {
            validateName();
            enableDisableButton();
        });

        emailInput.addEventListener('input', function () {
            validateEmail();
            enableDisableButton();
        });

        passwordInput.addEventListener('input', function () {
            updatePasswordStrength(this.value);
            validatePassword();
            enableDisableButton();
        });

        // Also validate on blur for error display
        nameInput.addEventListener('blur', validateName);
        emailInput.addEventListener('blur', validateEmail);
        passwordInput.addEventListener('blur', validatePassword);

        // Clear errors when user starts typing
        nameInput.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                nameError.textContent = "";
            }
        });

        emailInput.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                emailError.textContent = "";
            }
        });

        passwordInput.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                passwordError.textContent = "";
            }
        });

        // Initial validation check
        enableDisableButton();
    }
