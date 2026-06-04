[![Deploy](https://github.com/Goodsurfing/gs-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/Goodsurfing/gs-frontend/actions/workflows/deploy.yml)

# Локальный запуск против staging

Полный путь от чистого клона до работающего фронта на staging-данных:

```bash
nvm install        # подберёт версию из .nvmrc (Node 20+)
nvm use
npm ci
npm start          # http://localhost:3000
```

Никаких `.env` создавать не нужно — все умолчания committed в `.env.development`.

Под капотом dev-сервер проксирует `/api`, `/admin`, `/auth`, `/oauth2`, `/static-media`, `/media` на `https://api-staging.goodsurfing.org`. Он не подкладывает dev-токен в `Authorization`: Symfony воспринимает любой `Bearer` как JWT приложения и отвечает 401 на невалидные токены. Конфиг — в `.env.development`, проксирование — в `vite.config.ts`.

## Логин

VK-auth flow локально не работает (callback зарегистрирован на staging/prod-домены). Для входа используй тестовые аккаунты через `POST /api/v2/token`:

| email | password | роль |
|---|---|---|
| `vol@test.com` | `Test1234!` | волонтёр |
| `host@test.com` | `Test1234!` | хост |

(тот же набор использует `e2e/global-setup.ts`).

## Кастомизация

Чтобы переключить target — скопируй `.env.development.local.example` в `.env.development.local` (gitignored) и переопредели:

```env
VITE_DEV_API_TARGET="https://api-dev.goodsurfing.org"
```

# Build / deploy

Прод-сборка через `npm run build:prod` собирает SPA с зашитыми `VITE_API_BASE_URL` etc. (Docker `ARG` в `Dockerfile`). Реальные значения для каждого env живут в `.github/workflows/deploy-{dev,staging,prod}.yml`. Локальный `.env`/`.env.development` на build не влияют (Docker берёт значения из CI).
