# FROM ubuntu:16.04
# LABEL maintainer="Denis Stepanov dondiego4697@yandex.ru"

# WORKDIR /usr/local/app
# ENV WORKDIR /usr/local/app
# RUN mkdir /config-templates

# RUN apt-get update
# RUN apt-get install -fy wget git vim gettext-base net-tools
# RUN apt-get install -fy build-essential
# RUN apt-get install -fy nginx-full
# RUN apt-get install -fy curl
# RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
# RUN apt-get install -fy nodejs
# RUN apt-get install -fy supervisor
# RUN apt-get install -fy sudo

# COPY package.json package-lock.json Makefile Makefile.ts tsconfig.json ./
# RUN make deps
# COPY src ./src
# COPY configs ./configs
# COPY deploy/docker/main ./deploy/docker
# COPY tests ./tests
# COPY @types ./@types
# RUN make build

# RUN cp $WORKDIR/deploy/docker/config-templates/nginx.template.conf /config-templates/nginx.template.conf
# RUN cp $WORKDIR/deploy/docker/config-templates/supervisord.template.conf /config-templates/supervisord.template.conf
# RUN cp $WORKDIR/deploy/docker/start.sh /

# RUN make prune
# RUN mkdir $WORKDIR/logs

# CMD NODEJS_APP=$WORKDIR/build/src/app.js NODE_PATH=$WORKDIR/build /start.sh
