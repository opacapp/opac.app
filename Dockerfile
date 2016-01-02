FROM debian:jessie

MAINTAINER michel@rami.io

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -y python3 git python3-pip \
	libxml2-dev libxslt1-dev python-dev python-virtualenv locales libffi-dev \
	build-essential python3-dev zlib1g-dev libssl-dev npm gettext git \
	libpq-dev libmysqlclient-dev libmemcached-dev libjpeg-dev \
	--no-install-recommends

RUN dpkg-reconfigure locales && \
	locale-gen C.UTF-8 && \
	/usr/sbin/update-locale LANG=C.UTF-8
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir /data
RUN mkdir /code

COPY docker/get-pip.py /tmp/get-pip.py
RUN python3 /tmp/get-pip.py

COPY src/requirements.txt /tmp/requirements.txt
RUN pip install -q -r /tmp/requirements.txt

ENV DATA_DIR /data
COPY src /code/opacweb
COPY docker/local_settings.py /code/opacweb/opacweb/local_settings.py
COPY docker/entrypoint.sh /usr/local/bin/opacweb
RUN chmod +x /usr/local/bin/opacweb

WORKDIR /code/opacweb
RUN mkdir /data/logs
RUN python3 manage.py collectstatic --noinput

VOLUME /data

EXPOSE 80
ENTRYPOINT ["opacweb"]
