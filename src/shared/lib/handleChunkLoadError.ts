const RELOAD_KEY = "chunk-reload-at";
// Не чаще раза в минуту: если файл действительно недоступен, перезагрузка не
// поможет, и без паузы страница ушла бы в бесконечный цикл.
const RELOAD_COOLDOWN_MS = 60_000;

type ReloadStorage = Pick<Storage, "getItem" | "setItem">;

/**
 * Перезагружает страницу, если за последнюю минуту этого ещё не делали.
 * Возвращает true, если перезагрузка запущена.
 */
export const reloadOnceForChunkError = (
    storage: ReloadStorage = sessionStorage,
    reload: () => void = () => window.location.reload(),
    now: number = Date.now(),
): boolean => {
    const last = Number(storage.getItem(RELOAD_KEY) || 0);
    if (now - last < RELOAD_COOLDOWN_MS) {
        return false;
    }
    storage.setItem(RELOAD_KEY, String(now));
    reload();
    return true;
};

/**
 * Ошибка загрузки модуля страницы через React.lazy: старый чанк удалён
 * выкаткой или сбой сети. Тексты различаются по браузерам.
 */
export const isChunkLoadError = (error: unknown): boolean => {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS|ChunkLoadError/i
        .test(message);
};

/**
 * Не догрузился JS/CSS-чанк страницы (Vite шлёт `vite:preloadError`).
 * Чаще всего это вкладка, открытая до выкатки (старых файлов на сервере уже
 * нет), или сбой сети. Перезагружаем страницу один раз — пользователь получает
 * свежий index.html вместо пустого экрана, а ошибка не уходит в Bugsink.
 */
export const handleChunkLoadError = (
    event: Event,
    storage: ReloadStorage = sessionStorage,
    reload: () => void = () => window.location.reload(),
    now: number = Date.now(),
) => {
    if (reloadOnceForChunkError(storage, reload, now)) {
        event.preventDefault();
    }
    // Уже перезагружались — пусть ошибка идёт дальше как обычно
};

export const initChunkLoadErrorHandler = () => {
    window.addEventListener("vite:preloadError", (event) => handleChunkLoadError(event));
};
