/**
 * Служебные эндпоинты стейджа /api/test/* требуют заголовок X-E2E-Token
 * (стейдж публичный, без токена любой мог бы стереть базу через reset).
 * В CI токен — секрет репозитория E2E_TOKEN, локально —
 * `set -a; . ~/.config/goodsurfing/e2e-token.env; set +a`.
 */
export const hasE2eToken = () => !!process.env.E2E_TOKEN;

export const e2eHeaders = (): Record<string, string> => ({ 'X-E2E-Token': process.env.E2E_TOKEN ?? '' });

export const NO_TOKEN_REASON = 'нет E2E_TOKEN — служебные эндпоинты стейджа недоступны';
