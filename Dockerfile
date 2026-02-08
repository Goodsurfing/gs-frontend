# syntax=docker/dockerfile:1.4

# 1. For build React app
FROM node:14.18 AS development

# Set working directory
WORKDIR /app

# 
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install --legacy-peer-deps

COPY . /app

ENV CI=true
ENV PORT=3000

CMD [ "npm", "start" ]

FROM development AS build

ARG REACT_APP_API_BASE_URL
ARG REACT_APP_API_YANDEX_KEY
ARG REACT_APP_MAIN_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_API_YANDEX_KEY=$REACT_APP_API_YANDEX_KEY
ENV REACT_APP_MAIN_URL=$REACT_APP_MAIN_URL

RUN npm run build:prod


FROM development as dev-envs
RUN apt-get update && apt-get install -y --no-install-recommends git

RUN useradd -s /bin/bash -m vscode; \
    groupadd docker; \
    usermod -aG docker vscode;

# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD [ "npm", "start" ]

# 2. For Nginx setup
FROM nginx:alpine

# Copy config nginx
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy locales files
COPY --from=build /app/public/locales ./locales

# Copy static assets from builder stage
COPY --from=build /app/dist .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

