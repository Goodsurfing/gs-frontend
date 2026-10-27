const RELOAD_KEY = "chunk-reload-at";
// Не чаще раза в минуту: если файл действительно недоступен, перезагрузка не
// поможет, и без паузы страница ушла бы в бесконечный цикл.
const RELOAD_COOLDOWN_MS = 60_000;

/**
 * Не догрузился JS/CSS-чанк страницы (Vite шлёт `vite:preloadError`).
 * Чаще всего это вкладка, открытая до выкатки (старых файлов на сервере уже
 * нет), или сбой сети. Перезагружаем страницу один раз — пользователь получает
 * свежий index.html вместо пустого экрана, а ошибка не уходит в Bugsink.
 */
export const handleChunkLoadError = (
    event: Event,
    storage: Pick<Storage, "getItem" | "setItem"> = sessionStorage,
    reload: () => void = () => window.location.reload(),
    now: number = Date.now(),
) => {
    const last = Number(storage.getItem(RELOAD_KEY) || 0);
    if (now - last < RELOAD_COOLDOWN_MS) {
        // Уже перезагружались — пусть ошибка идёт дальше как обычно
        return;
    }
    event.preventDefault();
    storage.setItem(RELOAD_KEY, String(now));
    reload();
};

export const initChunkLoadErrorHandler = () => {
    window.addEventListener("vite:preloadError", (event) => handleChunkLoadError(event));
};
