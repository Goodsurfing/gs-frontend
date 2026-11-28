import { isChunkLoadError } from "@/lib/chunkReload";

/**
 * Шум в Bugsink от роботов и ChunkLoadError (25.11.2026).
 *
 * Рендер-робот Яндекса обходит /offers/:id и не догружает чанки — каждый релиз
 * давал новую задачу «ChunkLoadError: Failed to load chunk /_next/static/chunks/<хэш>.js»:
 * хэш в тексте меняется, Bugsink группирует заново, бот статуса шлёт «Новая ошибка».
 * У людей такая ошибка лечится перезагрузкой (lib/chunkReload.ts, ErrorScreen).
 */

// Явные роботы по User-Agent. Яндекс — только «compatible; Yandex…» (так
// подписаны все его роботы): у людей бывает YaBrowser и приложение YandexSearch.
const ROBOT_UA = /bot\b|bot\/|crawl|spider|slurp|HeadlessChrome|Lighthouse|Google-InspectionTool|compatible; Yandex/i;
// Телефоны Cubot — не роботы, хотя в названии «bot»
const NOT_ROBOT = /cubot/gi;

/** true — страницу открыл робот или браузер под управлением программы */
export function isRobot(userAgent: string, webdriver = false): boolean {
    if (webdriver) return true;
    return ROBOT_UA.test(userAgent.replace(NOT_ROBOT, ""));
}

type EventLike = {
    exception?: { values?: { type?: string; value?: string }[] };
    message?: string;
    fingerprint?: string[];
};

/** Одна задача ChunkLoadError на все релизы: в тексте ошибки — хэш файла, он меняется с каждой сборкой */
export const CHUNK_LOAD_FINGERPRINT = ["ChunkLoadError"];

/**
 * Решение по событию перед отправкой: null — не отправлять (робот),
 * иначе событие (у ChunkLoadError — с общим отпечатком без хэша).
 */
export function filterBrowserEvent<E extends EventLike>(event: E, userAgent: string, webdriver = false): E | null {
    if (isRobot(userAgent, webdriver)) return null;
    const texts = [
        ...(event.exception?.values ?? []).map(({ type, value }) => `${type ?? ""}: ${value ?? ""}`),
        event.message ?? "",
    ];
    if (texts.some((text) => text && (isChunkLoadError(text) || /Failed to load chunk /.test(text)))) event.fingerprint = CHUNK_LOAD_FINGERPRINT;
    return event;
}
