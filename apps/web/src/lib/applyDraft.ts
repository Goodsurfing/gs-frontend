import { type ApplyDates, APPLY_MESSAGE_MAX, periodIndex } from "@/lib/applyDates";
import { errorCode } from "@/lib/report";
import { browserStorage, storageGet, storageRemove, storageSet } from "@/lib/safeStorage";

/**
 * Черновик отклика на вакансию (GS-341). Волонтёр без членства заполнил даты и
 * «Пару слов о себе», отклик упёрся в лимит — он уходит оформлять членство, а
 * после оплаты возвращается к той же форме уже заполненной и отправляет её
 * одной кнопкой (сдача тестировщицы 27.11.2026: пришлось заполнять заново).
 *
 * - Хранится в localStorage браузера: возврат с ЮKassa — это новая вкладка или
 *   перезагрузка, sessionStorage туда не доживает.
 * - Ключ — пользователь + вакансия: на общем компьютере другой аккаунт чужой
 *   черновик не увидит; при выходе из аккаунта черновики удаляются.
 * - Живёт APPLY_DRAFT_TTL_MS — оплата может затянуться, но неделями чужие
 *   тексты в браузере не лежат. Удаляется после отправки отклика.
 */

/** Сколько живёт черновик и отметка «вернуть к отклику после оплаты» */
export const APPLY_DRAFT_TTL_MS = 3 * 24 * 60 * 60 * 1000;

const DRAFT_PREFIX = "gs.applyDraft.";
const RETURN_KEY = "gs.applyReturn";

export interface ApplyDraft {
    start: string | null;
    end: string | null;
    message: string;
    savedAt: number;
}

/** Отметка: ушёл с отклика оформлять членство — после оплаты предложить вернуться */
export interface ApplyReturn {
    userId: string;
    offerId: string;
    /** Название вакансии — показать на странице после оплаты, к чему вернёмся */
    title: string;
    at: number;
}

const draftKey = (userId: string, offerId: string) => `${DRAFT_PREFIX}${userId}.${offerId}`;

const isDay = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

const parse = (raw: string | null): unknown => {
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export function saveApplyDraft(userId: string, offerId: string, draft: Omit<ApplyDraft, "savedAt">, now: number = Date.now()): void {
    if (!userId || !offerId) return;
    const value: ApplyDraft = {
        start: isDay(draft.start) ? draft.start : null,
        end: isDay(draft.end) ? draft.end : null,
        message: draft.message.slice(0, APPLY_MESSAGE_MAX),
        savedAt: now,
    };
    storageSet(draftKey(userId, offerId), JSON.stringify(value));
}

/** Черновик пользователя для вакансии или null; просроченный и битый удаляются */
export function loadApplyDraft(userId: string, offerId: string, now: number = Date.now()): ApplyDraft | null {
    if (!userId || !offerId) return null;
    const key = draftKey(userId, offerId);
    const data = parse(storageGet(key)) as Partial<ApplyDraft> | null;
    const valid = !!data && typeof data === "object" && typeof data.savedAt === "number" && now - data.savedAt < APPLY_DRAFT_TTL_MS && data.savedAt <= now;
    if (!valid) {
        if (data !== null || storageGet(key) !== null) storageRemove(key);
        return null;
    }
    return {
        start: isDay(data.start) ? data.start : null,
        end: isDay(data.end) ? data.end : null,
        message: typeof data.message === "string" ? data.message.slice(0, APPLY_MESSAGE_MAX) : "",
        savedAt: data.savedAt!,
    };
}

export function clearApplyDraft(userId: string, offerId: string): void {
    if (userId && offerId) storageRemove(draftKey(userId, offerId));
}

/** Все ключи черновиков в хранилище (для уборки) */
function draftKeys(): string[] {
    const storage = browserStorage("local");
    if (!storage) return [];
    const keys: string[] = [];
    try {
        for (let index = 0; index < storage.length; index += 1) {
            const key = storage.key(index);
            if (key?.startsWith(DRAFT_PREFIX)) keys.push(key);
        }
    } catch {
        return [];
    }
    return keys;
}

/** Убрать просроченные черновики всех пользователей — чтобы тексты не копились в браузере */
export function pruneApplyDrafts(now: number = Date.now()): void {
    for (const key of draftKeys()) {
        const data = parse(storageGet(key)) as Partial<ApplyDraft> | null;
        if (!data || typeof data.savedAt !== "number" || now - data.savedAt >= APPLY_DRAFT_TTL_MS) storageRemove(key);
    }
    const mark = parse(storageGet(RETURN_KEY)) as Partial<ApplyReturn> | null;
    if (mark && (typeof mark.at !== "number" || now - mark.at >= APPLY_DRAFT_TTL_MS)) storageRemove(RETURN_KEY);
}

/** Выход из аккаунта: черновики и отметка возврата удаляются */
export function clearAllApplyDrafts(): void {
    for (const key of draftKeys()) storageRemove(key);
    storageRemove(RETURN_KEY);
}

export function markApplyReturn(mark: Omit<ApplyReturn, "at">, now: number = Date.now()): void {
    if (!mark.userId || !mark.offerId) return;
    storageSet(RETURN_KEY, JSON.stringify({ ...mark, title: mark.title.slice(0, 200), at: now } satisfies ApplyReturn));
}

/** Отметка возврата для этого пользователя или null (чужая и просроченная не отдаются) */
export function readApplyReturn(userId: string | null | undefined, now: number = Date.now()): ApplyReturn | null {
    if (!userId) return null;
    const mark = parse(storageGet(RETURN_KEY)) as Partial<ApplyReturn> | null;
    if (!mark || typeof mark !== "object" || typeof mark.at !== "number" || typeof mark.offerId !== "string") return null;
    if (now - mark.at >= APPLY_DRAFT_TTL_MS || mark.at > now) {
        storageRemove(RETURN_KEY);
        return null;
    }
    if (mark.userId !== userId || !/^\d+$/.test(mark.offerId)) return null;
    return { userId, offerId: mark.offerId, title: typeof mark.title === "string" ? mark.title : "", at: mark.at };
}

/** Отклик отправлен — отметка для этой вакансии больше не нужна */
export function clearApplyReturn(offerId?: string): void {
    const mark = parse(storageGet(RETURN_KEY)) as Partial<ApplyReturn> | null;
    if (!offerId || !mark || mark.offerId === offerId) storageRemove(RETURN_KEY);
}

/**
 * Даты из черновика, если они ещё подходят вакансии: у вакансии с периодами —
 * попадают в один из (будущих) периодов, без периодов — не в прошлом. Иначе
 * null — форма подставит даты как обычно, а текст из черновика останется.
 */
export function draftTerms(draft: Pick<ApplyDraft, "start" | "end">, dates: ApplyDates, today: string): { start: string; end: string } | null {
    const { start, end } = draft;
    if (!start || !end || end < start || start < today) return null;
    if (dates.kind === "periods") return periodIndex(dates.periods, { start, end }) >= 0 ? { start, end } : null;
    return { start, end };
}

/** Коды ошибок отклика, когда нужно членство: кончились бесплатные отклики или вакансия только для участников с членством */
const MEMBERSHIP_CODES = new Set(["application_limit_exceeded", "only_verified_volunteers_allowed"]);

/** Почему отклик не ушёл из-за членства: "limit" | "verified" | null — другая ошибка */
export function membershipRequired(body: unknown): "limit" | "verified" | null {
    const code = errorCode(body);
    if (!code || !MEMBERSHIP_CODES.has(code)) return null;
    return code === "application_limit_exceeded" ? "limit" : "verified";
}
