# MySQL Database Setup Guide

## Current Status
✅ MySQL driver (`mysqlclient`) is installed  
✅ Django configuration updated for MySQL  
⚠️ Need to create MySQL database and run migrations

## Step-by-Step Setup

### 1. Create MySQL Database

Login to MySQL and create the database:

```sql
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE gyanicode_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Run Migrations

After creating the database, run:

```bash
python manage.py migrate
```

This will create all tables in MySQL.

### 3. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

## Database Configuration

Current settings in `config/settings/base.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'gyanicode_db',
        'USER': 'root',
        'PASSWORD': 'root_db',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}
```

## If You Get Connection Errors

### Common Issues:

1. **Database doesn't exist**
   ```sql
   CREATE DATABASE gyanicode_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Wrong credentials**
   - Update USER and PASSWORD in settings/base.py

3. **MySQL not running**
   ```bash
   # Windows (as Administrator)
   net start MySQL
   
   # Or check MySQL service in Services
   ```

4. **Wrong port**
   - Default MySQL port is 3306
   - Check your MySQL configuration

## Switching Back to SQLite (if needed)

If you want to switch back to SQLite temporarily:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

Then delete SQLite database and run migrations again.

## Verification

After running migrations, check if tables are created:

```sql
USE gyanicode_db;
SHOW TABLES;
```

You should see tables like:
- junior_platform_user
- django_migrations
- django_session
- etc.


