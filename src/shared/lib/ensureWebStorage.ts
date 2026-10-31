/**
 * Хранилище браузера бывает недоступно: Safari с запретом cookies, встроенные
 * браузеры VK и Telegram, некоторые WebView. Тогда уже чтение
 * `window.localStorage` бросает SecurityError или возвращает null, а сайт
 * обращается к нему при запуске (вход, язык, корзина членства) и падает
 * целиком. Подставляем хранилище в памяти: сайт работает, просто ничего не
 * помнит между визитами.
 */
class MemoryStorage implements Storage {
    private items = new Map<string, string>();

    get length() {
        return this.items.size;
    }

    clear() {
        this.items.clear();
    }

    getItem(key: string) {
        return this.items.has(key) ? this.items.get(key)! : null;
    }

    key(index: number) {
        return Array.from(this.items.keys())[index] ?? null;
    }

    removeItem(key: string) {
        this.items.delete(key);
    }

    setItem(key: string, value: string) {
        this.items.set(key, String(value));
    }
}

type StorageName = "localStorage" | "sessionStorage";

const isUsable = (win: Window, name: StorageName): boolean => {
    try {
        const storage = win[name];
        if (!storage) return false;
        const probe = "__gs_storage_probe__";
        storage.setItem(probe, probe);
        storage.removeItem(probe);
        return true;
    } catch {
        return false;
    }
};

/** Возвращает имена хранилищ, которые пришлось заменить */
export const ensureWebStorage = (win: Window = window): StorageName[] => {
    const replaced: StorageName[] = [];
    (["localStorage", "sessionStorage"] as const).forEach((name) => {
        if (isUsable(win, name)) return;
        try {
            Object.defineProperty(win, name, { value: new MemoryStorage(), configurable: true });
            replaced.push(name);
        } catch {
            // Свойство не переопределить — остаётся как есть
        }
    });
    return replaced;
};

if (typeof window !== "undefined") {
    ensureWebStorage();
}
