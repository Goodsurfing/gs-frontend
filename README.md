[![Deploy](https://github.com/Goodsurfing/gs-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/Goodsurfing/gs-frontend/actions/workflows/deploy.yml)

# Локальный запуск против staging

```bash
nvm use 20       # Node 20+
npm ci
npm start        # http://localhost:3000
```

По умолчанию dev-сервер проксирует `/api`, `/admin`, `/auth`, `/oauth2`, `/static-media`, `/media` на `https://api-staging.goodsurfing.org` и добавляет IAP-токен в `Authorization: Bearer …` — обходим CORS и oauth2-proxy одним движением. Конфиг — в `.env.development`, проксирование — в `vite.config.ts`.

Чтобы переключить target или подложить свой IAP-токен — скопируй `.env.development.local.example` в `.env.development.local` (gitignored) и переопредели:

```env
VITE_DEV_API_TARGET="https://api-dev.goodsurfing.org"
VITE_DEV_IAP_TOKEN="yiap_..."
```

# Build / deploy

Прод-сборка через `npm run build:prod` собирает SPA с зашитыми `VITE_API_BASE_URL` etc. (Docker `ARG` в `Dockerfile`). Реальные значения для каждого env живут в `.github/workflows/deploy-{dev,staging,prod}.yml`. Локальный `.env`/`.env.development` на build не влияют (Docker берёт значения из CI).
