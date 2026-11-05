# gs-frontend

Веб-фронт Goodsurfing: сайт и админка — `apps/web` (Next.js), клиент API — `packages/api`, сквозные тесты — `e2e/`.

- Как устроен новый фронт, запуск и проверки — `apps/web/CLAUDE.md`.
- Правила репозитория — `CLAUDE.md`.

## Выкатка

- **Стейдж:** мерж в `develop` → `deploy-web-staging.yml` (образ `gs-web:staging`), затем `e2e-staging.yml`.
- **Прод:** тег `v*.*.*` на `master` → `deploy-web-prod.yml` (`gs-web:prod`), после выкатки прогрев кэша страниц.
- **Откат:** `rollback.yml` — образ `gs-web:sha-<коммит>` снова становится `:staging`/`:prod`.

Старое SPA (React + Vite) удалено 05.11.2026 (GS-222); история — в git до этого коммита.
