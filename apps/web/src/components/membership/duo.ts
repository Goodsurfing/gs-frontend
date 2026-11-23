/** Подстановка {{name}} в тексты «на двоих» (шаблоны приходят с сервера из словаря) */
export const fill = (template: string, values: Record<string, string | number>) =>
    template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) => String(values[name] ?? ""));

/** Дата из ATOM-строки API (это ISO, не d.m.Y) в виде 04.11.2027 */
export const atomDate = (value: string | null | undefined) =>
    value ? new Date(value).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }) : "";

export const personName = (person: { firstName?: string | null; lastName?: string | null } | null | undefined) =>
    [person?.firstName, person?.lastName].filter(Boolean).join(" ");

/** Ответ GET /api/v1/membership/duo */
export interface DuoState {
    role: "owner" | "partner" | null;
    token?: string | null;
    person?: { id: string; firstName?: string | null; lastName?: string | null } | null;
    endDate?: string | null;
    emailsLeft?: number | null;
    invitedEmail?: string | null;
}

/** Тексты раздела duo словаря membership — все ключи, которые использует сайт */
export const DUO_KEYS = [
    "offer-title", "offer-text", "offer-price", "offer-per-person", "offer-button",
    "panel-title", "panel-invite", "panel-copy", "panel-copied", "panel-share", "panel-share-text",
    "panel-email-label", "panel-email-placeholder", "panel-email-send", "panel-email-sent", "panel-email-left",
    "panel-regenerate", "panel-regenerate-hint", "panel-joined", "panel-partner", "panel-error",
    "invite-title", "invite-text", "invite-extend", "invite-accept", "invite-sign-in", "invite-sign-up",
    "invite-done", "invite-to-offers", "invite-not-found", "invite-expired", "invite-taken", "invite-own",
    "invite-host", "invite-lifetime", "invite-error",
] as const;
export type DuoLabels = Record<(typeof DUO_KEYS)[number], string>;

/** Подстановки оставляем как есть — их заполняет fill() уже со значениями */
const KEEP_PLACEHOLDERS = Object.fromEntries(["price", "name", "date", "email", "count"].map((name) => [name, `{{${name}}}`]));

/**
 * Все тексты «на двоих» для клиентских компонентов. Серверный переводчик
 * заменяет незаданные {{…}} пустой строкой — передаём их самих себе.
 */
export const duoLabels = (t: (key: string, values?: Record<string, string | number>) => string): DuoLabels =>
    Object.fromEntries(DUO_KEYS.map((key) => [key, t(`duo.${key}`, KEEP_PLACEHOLDERS)])) as DuoLabels;
