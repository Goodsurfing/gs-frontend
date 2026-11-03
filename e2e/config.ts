export const BASE_URL  = process.env.E2E_BASE_URL  ?? 'https://staging.goodsurfing.org';
export const API_URL   = process.env.E2E_API_URL   ?? 'https://api-staging.goodsurfing.org';

/**
 * Пароль тестовых аккаунтов vol@test.com / host@test.com на стейдже. Репозиторий
 * публичный, поэтому пароль только в переменной окружения (секрет CI
 * E2E_USERS_PASSWORD; локально — у владельца в ~/.config/goodsurfing/e2e-users.env).
 */
export const TEST_USERS_PASSWORD = process.env.E2E_USERS_PASSWORD ?? '';
