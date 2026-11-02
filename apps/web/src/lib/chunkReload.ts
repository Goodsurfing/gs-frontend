const RELOAD_KEY = "chunk-reload-at";
// Не чаще раза в минуту: если файл и правда недоступен, перезагрузка не
// поможет, а без паузы страница ушла бы в бесконечный цикл
const RELOAD_COOLDOWN_MS = 60_000;

type ReloadStorage = Pick<Storage, "getItem" | "setItem">;

/**
 * Не догрузился чанк страницы: вкладка открыта до выкатки (старых файлов
 * уже нет) или сбой сети. Тексты различаются по браузерам и сборщикам.
 */
export function isChunkLoadError(error: unknown): boolean {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return /ChunkLoadError|Loading chunk \S+ failed|Loading CSS chunk|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i
        .test(message);
}

/** Перезагружает страницу, если за последнюю минуту этого ещё не делали. true — перезагрузка запущена. */
export function reloadOnceForChunkError(
    storage: ReloadStorage = sessionStorage,
    reload: () => void = () => window.location.reload(),
    now: number = Date.now(),
): boolean {
    const last = Number(storage.getItem(RELOAD_KEY) || 0);
    if (now - last < RELOAD_COOLDOWN_MS) return false;
    storage.setItem(RELOAD_KEY, String(now));
    reload();
    return true;
}
