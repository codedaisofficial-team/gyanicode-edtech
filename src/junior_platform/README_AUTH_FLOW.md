# Authentication Flow Documentation

## Overview
This document explains the complete authentication flow implementation for the Junior Platform.

## Architecture

### Flow Structure
```
URL → View → Service (Business Logic) → Model → Database
```

### Key Principles
1. **Views handle only redirects/responses** - No business logic in views
2. **Services contain all business logic** - Data validation, processing, and database operations
3. **Models define data structure** - Database schema and relationships
4. **Separation of concerns** - Each layer has a specific responsibility

## Files Created/Modified

### 1. Model Layer
**File:** `junior_platform/models/auth.py`

**Purpose:** Define the User model structure

**Key Features:**
- Custom User model extending `AbstractBaseUser`
- Email-based authentication
- Fields: email, full_name, phone_number, profile_picture
- Timestamps: date_joined, last_login, updated_at
- Custom UserManager for creating users

### 2. Service Layer
**File:** `junior_platform/services/auth.py`

**Purpose:** Contains all business logic for authentication

**Methods:**
- `validate_registration_data(data)` - Validates form data
- `register_user(data)` - Creates new user
- `authenticate_user(email, password)` - Authenticates user
- `check_email_exists(email)` - Checks if email exists
- `get_user_by_email(email)` - Retrieves user by email

**Key Features:**
- Data validation (email format, password strength, name length)
- Database transaction handling
- Error handling and reporting
- Returns structured responses (success, errors)

### 3. View Layer
**File:** `junior_platform/views.py`

**Purpose:** Handle HTTP requests and responses

**Views:**
- `register_view()` - Handles GET and POST for registration
- `login_view()` - Handles GET and POST for login
- `junior_home()` - Home page
- `dashboard_view()` - Protected dashboard (requires login)

**Key Features:**
- Extracts form data from request
- Calls service methods
- Displays messages to user
- Handles redirects
- No business logic

### 4. Templates
**Files:** 
- `junior_platform/templates/core/auth/register.html`
- `junior_platform/templates/core/auth/login.html`

**Updates:**
- Added CSRF token to forms
- Connected forms to correct URLs
- Added message display for success/error
- Linked navigation between login and register pages

### 5. Admin Configuration
**File:** `junior_platform/admin.py`

**Purpose:** Django admin interface for User model

**Features:**
- User list display
- Search and filtering
- Custom fieldsets
- Add user functionality

### 6. Settings
**File:** `config/settings/base.py`

**Changes:**
- Added `AUTH_USER_MODEL = 'junior_platform.User'`
- Configured message tags for Django messages

## Registration Flow

### Step-by-Step Process

1. **User visits registration page**
   - URL: `/junior/register/`
   - View: `register_view()` (GET request)
   - Returns: Registration form template

2. **User fills form and submits**
   - Form POSTs to `/junior/register/`
   - View: `register_view()` (POST request)

3. **View extracts data**
   ```python
   form_data = {
       'name': request.POST.get('name', ''),
       'email': request.POST.get('email', ''),
       'password': request.POST.get('password', ''),
   }
   ```

4. **View calls service**
   ```python
   success, result = AuthService.register_user(form_data)
   ```

5. **Service validates data**
   - Checks email format
   - Checks email uniqueness
   - Validates name length
   - Validates password strength

6. **Service creates user**
   - If validation passes, creates User object
   - Returns (True, user_object)
   - If validation fails, returns (False, errors_dict)

7. **View handles response**
   - If success: Shows success message, redirects to login
   - If failure: Shows error messages, re-renders form

## Login Flow

### Step-by-Step Process

1. **User visits login page**
   - URL: `/junior/login/`
   - View: `login_view()` (GET request)
   - Returns: Login form template

2. **User submits credentials**
   - Form POSTs to `/junior/login/`
   - View: `login_view()` (POST request)

3. **View calls service**
   ```python
   user = AuthService.authenticate_user(email, password)
   ```

4. **Service authenticates**
   - Checks email and password
   - Returns User object if valid, None if invalid

5. **View handles response**
   - If user exists: Logs in user, redirects to home
   - If invalid: Shows error message, re-renders form

## Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character

## Usage Examples

### Testing Registration

1. Start the server:
   ```bash
   python manage.py runserver
   ```

2. Visit: `http://localhost:8000/junior/register/`

3. Fill the form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "Test123!"

4. Click "Create Account"

5. You'll be redirected to login page with success message

### Testing Login

1. Visit: `http://localhost:8000/junior/login/`

2. Enter credentials:
   - Email: "john@example.com"
   - Password: "Test123!"

3. Click "Sign In"

4. You'll be redirected to home page

## Database Schema

### User Model Fields

- `email` - EmailField (unique, indexed)
- `full_name` - CharField (max 150 chars)
- `phone_number` - CharField (optional, with regex validator)
- `password` - Password field (hashed)
- `is_active` - Boolean (default: True)
- `is_staff` - Boolean (default: False)
- `is_superuser` - Boolean (default: False)
- `profile_picture` - ImageField (optional)
- `date_joined` - DateTimeField (auto_now_add)
- `last_login` - DateTimeField (auto_now)
- `updated_at` - DateTimeField (auto_now)

## Error Handling

### Validation Errors
- Shown as error messages on the form
- Each field can have specific error messages
- Errors are displayed using Django messages framework

### Common Errors
- "Email is required"
- "Please enter a valid email address"
- "This email is already registered"
- "Name must be at least 3 characters long"
- "Password must be at least 8 characters long"
- "Password must contain at least one uppercase letter"
- etc.

## Security Features

1. **CSRF Protection** - All forms include CSRF tokens
2. **Password Hashing** - Passwords are stored as hashes
3. **Email Uniqueness** - Prevents duplicate accounts
4. **SQL Injection Protection** - Django ORM handles SQL safely
5. **Session Management** - Django handles user sessions securely

## Next Steps

1. Create admin superuser:
   ```bash
   python manage.py createsuperuser
   ```

2. Test admin interface at: `http://localhost:8000/admin/`

3. Create additional features:
   - Password reset functionality
   - Email verification
   - Profile editing
   - Social authentication

## Troubleshooting

### Migration Issues
If you get migration errors:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Import Errors
Make sure the models are imported in `__init__.py`:
```python
from .auth import User
```

### Form Not Submitting
Check that:
- CSRF token is included
- Form action points to correct URL
- Method is POST

## Summary

This implementation follows Django best practices:
- **Separation of concerns** - Views handle HTTP, Services handle logic
- **Reusable code** - Service methods can be called from anywhere
- **Maintainable** - Changes to business logic only affect service layer
- **Testable** - Services can be unit tested independently
- **Scalable** - Easy to add new features and functionality


