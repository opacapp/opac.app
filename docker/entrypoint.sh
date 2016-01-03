#!/bin/bash
NAME="opacweb"
DJANGODIR=/code/opacweb
NUM_WORKERS=25
DJANGO_SETTINGS_MODULE=opacweb.local_settings
DJANGO_WSGI_MODULE=opacweb.wsgi

cd $DJANGODIR

export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH

if [ ! -d /data/logs ]; then
    mkdir /data/logs;
fi
if [ ! -d /data/media ]; then
    mkdir /data/media;
fi


if [ "$1" == "web" ]; then
	python3 manage.py migrate --noinput
	python3 manage.py collectstatic --noinput
	python3 manage.py compilemessages
	
    exec gunicorn ${DJANGO_WSGI_MODULE}:application \
        --name $NAME \
        --workers $NUM_WORKERS \
        --max-requests 1200 \
        --log-level=info \
        --bind=0.0.0.0:80
fi

if [ "$1" == "shell" ]; then
    exec python3 manage.py shell
fi

if [ "$1" == "test" ]; then
    exec python3 manage.py test explorer
fi

if [ "$1" == "all" ]; then
	/usr/bin/supervisord
fi

echo "Specify argument: all|web|shell|test"
exit 1
