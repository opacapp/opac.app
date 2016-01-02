import os
from django.utils.crypto import get_random_string

from .settings import *


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.' + os.getenv('OPACWEB_DB_TYPE', 'sqlite3'),
        'NAME': os.getenv('OPACWEB_DB_NAME', 'opacweb.db'),
        'USER': os.getenv('OPACWEB_DB_USER', ''),
        'PASSWORD': os.getenv('OPACWEB_DB_PASS', ''),
        'HOST': os.getenv('OPACWEB_DB_HOST', ''),
        'PORT': os.getenv('OPACWEB_DB_PORT', ''),
        'CONN_MAX_AGE': 600
    }
}

TEMPLATES[0]['OPTIONS']['loaders'] = [('django.template.loaders.cached.Loader', TEMPLATES[0]['OPTIONS']['loaders'])]

ADMINS = (
    ('Raphael Michel', 'admin@rami.io'),
)

DEBUG = False

STATIC_ROOT = '/static/'
STATIC_URL = '/static/'

SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_DOMAIN = os.getenv('OPACWEB_COOKIE_DOMAIN', '')
SESSION_COOKIE_SECURE = os.getenv('OPACWEB_HTTPS', 'True') == 'True'
SESSION_COOKIE_NAME = os.getenv('OPACWEB_COOKIE_PREFIX', '') + 'sessionid'

DATA_DIR = os.environ.get('DATA_DIR', 'data')

SECRET_FILE = os.path.join(DATA_DIR, '.secret')
if os.path.exists(SECRET_FILE):
    with open(SECRET_FILE, 'r') as f:
        SECRET_KEY = f.read().strip()
else:
    chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)'
    SECRET_KEY = get_random_string(50, chars)
    with open(SECRET_FILE, 'w') as f:
        f.write(SECRET_KEY)

EMAIL_HOST = os.getenv('OPACWEB_SMTP_HOST', 'localhost')
EMAIL_PORT = int(os.getenv('OPACWEB_SMTP_PORT', 25))
EMAIL_HOST_USER = os.getenv('OPACWEB_SMTP_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('OPACWEB_SMTP_USER', '')
EMAIL_HOST_USE_TLS = os.getenv('OPACWEB_SMTP_TLS', 'False') == 'True'
EMAIL_HOST_USE_SSL = os.getenv('OPACWEB_SMTP_SSL', 'False') == 'True'

CSRF_COOKIE_DOMAIN = os.getenv('OPACWEB_COOKIE_DOMAIN', '')
CSRF_COOKIE_NAME = 'csrftoken'

MEDIA_ROOT = '/data/media/'
MEDIA_URL = '/media/'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
    },
    'handlers': {
        'errfile': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': '/data/logs/django.err.log'
        },
        'mail_admins': {
            'level': 'ERROR',  # set to WARNING to debug strange things
            'filters': ['require_debug_false'],
            'include_html': True,
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins', 'errfile'],
            'level': 'WARNING',
            'propagate': True,
        },
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

ALLOWED_HOSTS = ['opacapp.de', 'opacapp.net', 'new.opacapp.net', 'www.opacapp.de', 'www.opacapp.net']

# Enable when https://github.com/divio/django-filer/issues/630 is resolved
# STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'
