# syntax=docker/dockerfile:1.4

# 1. Install dependencies
FROM node:20-alpine AS development

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN --mount=type=cache,target=/root/.npm \
    npm install --legacy-peer-deps

COPY . /app

ARG VITE_API_BASE_URL
ARG VITE_API_YANDEX_KEY
ARG VITE_MAIN_URL
ARG VITE_VKID_CLIENT_ID

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_YANDEX_KEY=$VITE_API_YANDEX_KEY
ENV VITE_MAIN_URL=$VITE_MAIN_URL
ENV VITE_VKID_CLIENT_ID=$VITE_VKID_CLIENT_ID

ENV CI=true
ENV PORT=3000

CMD [ "npm", "start" ]

# 2. Build
FROM development AS build

RUN npm run build:prod

# 3. Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

# Vite copies public/ into dist/ automatically (includes locales)
COPY --from=build /app/dist .

# Remove dev-only MSW service worker from production
RUN rm -f ./mockServiceWorker.js

ENTRYPOINT ["nginx", "-g", "daemon off;"]
