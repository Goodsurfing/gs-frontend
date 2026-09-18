[![Deploy](https://github.com/Goodsurfing/gs-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/Goodsurfing/gs-frontend/actions/workflows/deploy.yml)

# gs-frontend

SPA GoodSurfing: React 18 + TypeScript + **Vite** (не Webpack — миграция произошла, но не все внешние заметки об этом знают), Redux Toolkit, react-router-dom, i18next. Структура — Feature-Sliced Design: `app/` → `pages/` → `widgets/` → `features/` → `entities/` → `shared/`.

Актуализировано 2026-09-18 по факту `package.json`/`src/`.

## Архитектура (FSD)

- `pages/` — маршрутизируемые страницы (публичный сайт, кабинеты волонтёра/хоста, админка — префикс `Admin*`)
- `widgets/` — крупные независимые блоки страницы (Header, Footer, сайдбары, списки)
- `features/` — конкретные пользовательские сценарии (форма регистрации, добавление отзыва, карта предложений и т.д.)
- `entities/` — бизнес-сущности с собственным стейтом/типами (User, Offer, Volunteer, Host, Academy...)
- `shared/` — переиспользуемые UI-кит компоненты, хуки, утилиты, без бизнес-логики
- `store/` — Redux Toolkit store и слайсы
- `routes/` — конфигурация маршрутов

## Разделы приложения (по `src/pages/`)

| Раздел | Примеры страниц |
|---|---|
| Публичный сайт | `MainPage`, `OffersMapPage`, `OfferPersonalPage`, `BlogPage`, `NewsPage`, `AboutProjectPage`, `OurTeamPage`, `NPOPage`, `RulesPage` |
| Регистрация/аутентификация | `SignInPage`, `SignUpPage`, `ResetPasswordPage`, `VerifyEmailPage`, `ConfirmEmailPage` |
| Кабинет волонтёра | `VolunteerDashboardPage`, `VolunteerPersonalPage`, `VolunteerSkillsPage`, `VolunteerGalleryPage`, `VolunteerArticlesPage` |
| Кабинет хоста | `HostDashboardPage`, `HostOffersPage`, `HostFundraisePage`, `HostTeamPage`, `HostRegisterPage` |
| Академия | `AcademyMainPage`, `AcademyCoursePage`, `AcademyLessonPage` |
| Платное членство и оплата | `MembershipPage`, `PaymentPage`, `PaymentSuccessPage`, `PaymentFailPage`, `DonationPersonalPage`, `DonationsMapPage` |
| Сбор средств | `FundraiseWelcomePage`, `FundraiseStepPage`, `FundraiseLayoutPage` |
| Профиль | `ProfileInfoPage`, `ProfilePrivacyPage`, `ProfileRolePage`, `ProfilePreferencesPage` |
| Мессенджер | `MessengerPage` |
| Админка | ~60 страниц с префиксом `Admin*` — отдельная CRUD-панель почти под каждый модуль бэкенда (блог, курсы, баннеры, пользователи, отзывы и т.д.) |

## Локальный запуск против staging

Полный путь от чистого клона до работающего фронта на staging-данных:

```bash
nvm install        # подберёт версию из .nvmrc (Node 20+)
nvm use
npm ci
npm start          # http://localhost:3000
```

Никаких `.env` создавать не нужно — все умолчания committed в `.env.development`.

Под капотом dev-сервер проксирует `/api`, `/admin`, `/auth`, `/oauth2`, `/static-media`, `/media` на `https://api-staging.goodsurfing.org` и подкладывает IAP-токен в `Authorization: Bearer …` — обходим CORS и oauth2-proxy одним движением. Конфиг — в `.env.development`, проксирование — в `vite.config.ts`.

## Логин

VK-auth flow локально не работает (callback зарегистрирован на staging/prod-домены). Для входа используй тестовые аккаунты через `POST /api/v2/token`:

| email | password | роль |
|---|---|---|
| `vol@test.com` | `Test1234!` | волонтёр |
| `host@test.com` | `Test1234!` | хост |

(тот же набор использует `e2e/global-setup.ts`).

## Кастомизация

Чтобы переключить target или подложить свой IAP-токен — скопируй `.env.development.local.example` в `.env.development.local` (gitignored) и переопредели:

```env
VITE_DEV_API_TARGET="https://api-dev.goodsurfing.org"
VITE_DEV_IAP_TOKEN="yiap_..."
```

# Build / deploy

Прод-сборка через `npm run build:prod` собирает SPA с зашитыми `VITE_API_BASE_URL` etc. (Docker `ARG` в `Dockerfile`). Реальные значения для каждого env живут в `.github/workflows/deploy-{staging,prod}.yml` — `deploy-dev.yml` больше не существует, `dev`-окружение снесено 2026-07-10. Локальный `.env`/`.env.development` на build не влияют (Docker берёт значения из CI). staging деплоится по пушу в `main`/`master`, prod — по git-тегу `v*.*.*` (см. `rollback.yml` для отката).
