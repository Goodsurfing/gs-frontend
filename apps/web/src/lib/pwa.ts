/**
 * Сайт как приложение на iPhone (решение владельца 24.11.2026): человек ставит
 * сайт на экран «Домой» — так на iPhone приходят веб-пуши (только у
 * установленного сайта, iOS 16.4+), а членство оплачивается на сайте, как обычно.
 * Здесь — чистые правила: где показывать подсказку «Установить», открыт ли сайт
 * с экрана «Домой». Браузерное окружение передаётся параметром — так проще тестировать.
 */

/** «Позже» прячет подсказку на 14 дней */
export const INSTALL_HINT_PAUSE_MS = 14 * 24 * 3600 * 1000;
export const INSTALL_HINT_DISMISSED_KEY = "gs-install-hint-dismissed";
/** Цель Метрики pwa_installed уже отправлена с этого установленного сайта */
export const PWA_INSTALLED_KEY = "gs-pwa-installed";

/**
 * Встроенные браузеры и чужие браузеры на iPhone: у них в user agent тоже есть
 * «Safari», но кнопки «На экран „Домой“» нет или она в другом месте, а
 * инструкция — про Safari.
 */
const NOT_SAFARI = /CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|YaBrowser|YaApp|GSA\/|DuckDuckGo|FBAN|FBAV|VKClient|vkontakte|Telegram|Line\/|MailRuSputnik|Mail\.Ru/i;

/** Safari на iPhone (не iPad: там другое расположение кнопок, и речь была про телефон) */
export function isIphoneSafari(userAgent: string): boolean {
    if (!/iPhone|iPod/.test(userAgent)) return false;
    // У Safari есть и «Version/…», и «Safari/…»; у встроенных браузеров приложений обычно нет
    if (!/Version\/[\d.]+/.test(userAgent) || !/Safari\//.test(userAgent)) return false;
    return !NOT_SAFARI.test(userAgent);
}

export interface DisplayEnv {
    /** navigator.standalone — есть только у Safari на iPhone/iPad */
    navigatorStandalone?: boolean;
    /** matchMedia("(display-mode: standalone)") */
    displayModeStandalone: boolean;
}

/** Сайт открыт с экрана «Домой» (без строки адреса) */
export function isStandalone(env: DisplayEnv): boolean {
    return env.navigatorStandalone === true || env.displayModeStandalone;
}

/** Показать подсказку: Safari на iPhone, сайт открыт не с экрана «Домой», «Позже» не нажимали 14 дней */
export function shouldShowInstallHint(env: DisplayEnv & { userAgent: string }, dismissedAt: number | null, now: number): boolean {
    if (!isIphoneSafari(env.userAgent) || isStandalone(env)) return false;
    return dismissedAt === null || now - dismissedAt > INSTALL_HINT_PAUSE_MS;
}

/** Окружение текущего браузера (только в браузере) */
export function currentDisplayEnv(): DisplayEnv & { userAgent: string } {
    return {
        userAgent: navigator.userAgent,
        navigatorStandalone: (navigator as { standalone?: boolean }).standalone,
        displayModeStandalone: window.matchMedia?.("(display-mode: standalone)").matches ?? false,
    };
}

/** Время из хранилища: число больше нуля или null */
export function parseTimestamp(value: string | null): number | null {
    const number = Number(value);
    return value !== null && Number.isFinite(number) && number > 0 ? number : null;
}
