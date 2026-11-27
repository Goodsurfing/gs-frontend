/**
 * Надпись «Тестовая версия» в ленте соцсетей на стейдже и ссылка «Сообщить о проблеме» в бот «Клуба первых».
 * Включается только при сборке с NEXT_PUBLIC_TEST_BOT (задан в deploy-web-staging.yml, на проде — нет).
 */
export const TEST_BOT = process.env.NEXT_PUBLIC_TEST_BOT ?? "";

/**
 * Тестовая карта для оплаты на стейдже (тестовый магазин ЮKassa): «Мир» с подтверждением
 * на тестовой странице 3-D Secure. Mastercard 5555 5555 5555 4444 с 25.11.2026 отвечает
 * «технический сбой». Та же карта — в e2e/support/yookassa.ts.
 */
export const TEST_CARD = "2200 0000 0000 0004";

/** Параметр /start в Telegram: латиница, цифры, «_» и «-», до 64 знаков. Путь страницы — в base64url. */
export function reportStartParam(path: string): string {
    const bytes = new TextEncoder().encode(path);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const encoded = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const param = `bug_${encoded}`;
    return param.length <= 64 ? param : "bug";
}

export function reportLink(bot: string, path: string): string {
    return `https://t.me/${bot}?start=${reportStartParam(path)}`;
}
