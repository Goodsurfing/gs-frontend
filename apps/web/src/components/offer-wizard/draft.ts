/**
 * Несохранённые правки шага в sessionStorage (как в старом фронте): ушли со
 * страницы и вернулись — правки на месте, над кнопками предупреждение.
 * Ключи свои, не старого SPA: форматы данных у фронтов разные.
 */
const key = (step: string, id: string) => `gs-web-offer-${step}-${id}`;

export function readDraft<T>(step: string, id: string, valid: (value: unknown) => value is T): T | null {
    try {
        const raw = window.sessionStorage.getItem(key(step, id));
        const value: unknown = raw ? JSON.parse(raw) : null;
        return valid(value) ? value : null;
    } catch {
        return null;
    }
}

export function writeDraft(step: string, id: string, value: unknown) {
    try {
        window.sessionStorage.setItem(key(step, id), JSON.stringify(value));
    } catch {
        // Хранилище недоступно (приватный режим) — правки живут до ухода со страницы
    }
}

export function clearDraft(step: string, id: string) {
    try {
        window.sessionStorage.removeItem(key(step, id));
    } catch {
        // см. writeDraft
    }
}
