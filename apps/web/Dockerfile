# syntax=docker/dockerfile:1
# Новый веб-фронт (эпик GS-212). Контекст сборки — корень репозитория:
#   docker build -f apps/web/Dockerfile .
# нужны общие словари public/locales и packages/api.

FROM node:20-alpine AS deps
WORKDIR /repo
COPY packages/api/package.json packages/api/package-lock.json packages/api/
RUN cd packages/api && npm ci --no-audit --no-fund
COPY apps/web/package.json apps/web/package-lock.json apps/web/
RUN cd apps/web && npm ci --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /repo
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL
# Bugsink и Метрика: без значений сбор выключен (стенды без мониторинга, локально)
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_ENVIRONMENT
ARG NEXT_PUBLIC_SENTRY_RELEASE
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    NEXT_PUBLIC_SENTRY_ENVIRONMENT=$NEXT_PUBLIC_SENTRY_ENVIRONMENT \
    NEXT_PUBLIC_SENTRY_RELEASE=$NEXT_PUBLIC_SENTRY_RELEASE \
    NEXT_PUBLIC_YANDEX_METRIKA_ID=$NEXT_PUBLIC_YANDEX_METRIKA_ID \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /repo/packages/api/node_modules packages/api/node_modules
COPY --from=deps /repo/apps/web/node_modules apps/web/node_modules
COPY packages/api packages/api
COPY apps/web apps/web
COPY public/locales public/locales
RUN cd apps/web && npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3100 \
    HOSTNAME=0.0.0.0
RUN addgroup -S web && adduser -S web -G web
COPY --from=build --chown=web:web /repo/apps/web/.next/standalone ./
COPY --from=build --chown=web:web /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=web:web /repo/apps/web/public ./apps/web/public
COPY --from=build --chown=web:web /repo/apps/web/locales ./apps/web/locales
USER web
EXPOSE 3100
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD wget -qO- http://127.0.0.1:3100/healthz || exit 1
WORKDIR /app/apps/web
CMD ["node", "server.js"]
