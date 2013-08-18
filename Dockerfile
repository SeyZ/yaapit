# DOCKER-VERSION 0.3.4
FROM ubuntu
MAINTAINER Sandro Munda <sandro@munda.me>

RUN apt-get install -y python-software-properties git make g++
RUN add-apt-repository ppa:chris-lea/node.js
RUN echo "deb http://us.archive.ubuntu.com/ubuntu/ precise universe" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y nodejs

RUN npm install -g supervisor

ADD . /var/www

CMD cd /var/www; npm link; supervisor -i public/ app.js
