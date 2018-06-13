FROM node:8-alpine

ARG USER_NAME=semanticWeb
ARG USER_GROUP=${USER_NAME}
ARG USER_DIR=/home/${USER_NAME}

ARG PROJECT_DIR=${USER_DIR}/project

ARG USER_GROUP_ID=2000
ARG USER_ID=2000

ARG NODE_GROUP_ID=1000
ARG NODE_USER_ID=1000

ARG NPM_AUTH_TOKEN

ARG SERVICE_ENVIRONMENT=development
ARG SERVICE_LOGDIRECTORY=/var/log/semanticWeb
ARG SERVICE_SERVER_PORT=80

ENV VOLTRON_ENVIRONMENT=${SERVICE_ENVIRONMENT} \
    VOLTRON_LOGDIRECTORY=${SERVICE_LOGDIRECTORY} \
    VOLTRON_SERVER_PORT=${SERVICE_SERVER_PORT} \
    PROJECT_DIR=${PROJECT_DIR}

RUN if [ $NODE_GROUP_ID -ne 1000 ] \
    || [ $NODE_USER_ID -ne 1000 ] \
  ; then \
       deluser node \
    && addgroup -g $NODE_GROUP_ID \
                node \
    && adduser -D -H \
               -h /home/node \
               -s /bin/sh \
               -G node \
               -u $NODE_USER_ID \
               node \
  ; fi \
 && if [ $NODE_GROUP_ID -ne 1000 ] \
  ; then \
       find / \
            -group 1000 \
            -exec chgrp -h node {} + \
  ; fi \
 && if [ $NODE_USER_ID -ne 1000 ] \
  ; then \
       find / \
            -user 1000 \
            -exec chown -h node {} + \
  ; fi \
 && if [ "${USER_GROUP}" != "node" ] \
    && [ $USER_GROUP_ID -ge 1000 ] \
  ; then \
       addgroup -g $USER_GROUP_ID \
                $USER_GROUP \
  ; fi \
 && if [ "${USER_NAME}" != "node" ] \
  ; then \
       adduser -D \
               -h $USER_DIR \
               -s /bin/sh \
               -G $USER_GROUP \
               -u $USER_ID \
               $USER_NAME \
  ; fi \
 && mkdir -p $SERVICE_LOGDIRECTORY \
 && mkdir -p $PROJECT_DIR \
 && chown -R $USER_NAME:$USER_GROUP $SERVICE_LOGDIRECTORY \
 && chown -R $USER_NAME:$USER_GROUP $PROJECT_DIR \
 && apk add --no-cache \
            --virtual .setcap-deps \
            libcap \
 && setcap 'cap_net_bind_service=+ep' `readlink -f \`which node\`` \
 && apk del .setcap-deps \
 && npm i -g pm2 \
 && npm cache clean --force

WORKDIR $PROJECT_DIR

USER $USER_NAME:$USER_GROUP
COPY package.json ./

USER root:root

RUN apk add --no-cache \
              --virtual .build-deps-project \
              g++ \
              make \
              python

USER $USER_NAME:$USER_GROUP
COPY . ./


USER root:root
RUN if [ "${SERVICE_ENVIRONMENT}" == "local" ] \
    || [ "${SERVICE_ENVIRONMENT}" == "development" ] \
  ; then \
       chown -R $USER:$USER_GROUP $PROJECT_DIR \
  ; fi

USER $USER_NAME:$USER_GROUP

EXPOSE $SERVICE_SERVER_PORT


CMD ["npm","run","start"]

