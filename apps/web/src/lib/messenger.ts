import type { components } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";

/** Чат в списке и в шапке (GET /api/v1/personal/chats, /api/v1/chats/{id}) */
export type Chat = components["schemas"]["Chat-chat.read_organization.short_message.read_volunteer.read-with-profile_user.short_media_object.read"];
export type ChatParticipant = NonNullable<Chat["otherParticipants"]>[number];
/** Сообщение; в событии Mercure есть ещё IRI чата */
export type ChatMessage = components["schemas"]["Message-message.read"] & { chat?: string };
export type ApplicationStatus = "new" | "accepted" | "canceled";
/** Заявка, о которой переписка: вакансия, даты, статус (null — переписка без заявки) */
export type ChatApplication = NonNullable<Chat["application"]>;

/** Цвета статусов заявки (offerState старого фронта): точка в списке чатов и в фильтре */
export const STATUS_COLORS: Record<ApplicationStatus, string> = {
    new: "#79C8FF",
    accepted: "#77EB98",
    canceled: "#FCC3C3",
};

/** Последняя часть IRI: "/api/v1/chats/12" → "12" */
export const idFromIri = (iri: string | null | undefined): string | undefined => iri?.split("/").filter(Boolean).pop();

const timeOf = (chat: Chat) => (chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).getTime() : (chat.id ?? 0));

/** Сначала чаты с самым свежим сообщением; без сообщений — по номеру чата */
export const sortChats = (chats: Chat[]): Chat[] => [...chats].sort((a, b) => timeOf(b) - timeOf(a));

/**
 * Новое сообщение из Mercure в списке чатов: точечно меняем последнее
 * сообщение и счётчик непрочитанных, без перезапроса всего списка (иначе
 * список «моргал» и прыгал при активной переписке). Чата нет в списке —
 * без изменений, он появится при следующей загрузке.
 */
export function applyIncomingMessage(chats: Chat[], message: ChatMessage): Chat[] {
    const chatId = Number(idFromIri(message.chat));
    if (!chatId) return chats;
    return chats.map((chat) => {
        if (chat.id !== chatId || !chat.lastMessage) return chat;
        // В событии автор — IRI; в списке нужен объект с id, чтобы понять «Вы:» и «Ждут ответа»
        const authorId = idFromIri(message.author);
        const author = authorId && authorId !== chat.lastMessage.author?.id ? { id: authorId } : chat.lastMessage.author;
        return {
            ...chat,
            lastMessage: { ...chat.lastMessage, ...message, author } as Chat["lastMessage"],
            countUnreadMessages: (chat.countUnreadMessages ?? 0) + 1,
        };
    });
}

/** Сообщения по убыванию даты, без повторов (страницы и события Mercure пересекаются) */
export function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
    const byId = new Map<number, ChatMessage>();
    for (const message of [...current, ...incoming]) {
        if (typeof message.id === "number") byId.set(message.id, message);
    }
    return [...byId.values()].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
}

const LOCALES: Record<Locale, string> = { ru: "ru-RU", en: "en-US", es: "es-ES" };

/** Дата под сообщением и в списке: сегодня — время, иначе ДД.ММ.ГГГГ (formatMessageDate старого фронта) */
export function formatMessageDate(locale: Locale, iso: string | null | undefined, noDate: string, now = new Date()): string {
    if (!iso) return noDate;
    const date = new Date(iso);
    const tag = LOCALES[locale];
    const today = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
    if (today) return date.toLocaleTimeString(tag, { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString(tag, { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/[-/]/g, ".");
}

/** Дата текстом ДД.ММ.ГГГГ (даты заявки в карточке) */
export function formatDay(locale: Locale, value: string | Date): string {
    return new Date(value).toLocaleDateString(LOCALES[locale], { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/[-/]/g, ".");
}

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
const daysAgo = (date: Date, now: Date) => Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase() + text.slice(1);
/** «Сегодня», «Вчера» на языке страницы — из Intl, без своих словарей */
const relativeDay = (locale: Locale, days: 0 | 1) => capitalize(new Intl.RelativeTimeFormat(LOCALES[locale], { numeric: "auto" }).format(-days, "day"));

/**
 * Время в списке чатов (как в почте и мессенджерах): сегодня — «14:05»,
 * вчера — «Вчера», на этой неделе — день недели, в этом году — «5 нояб.»,
 * раньше — ДД.ММ.ГГГГ.
 */
export function formatListTime(locale: Locale, iso: string | null | undefined, now = new Date()): string {
    if (!iso) return "";
    const date = new Date(iso);
    const tag = LOCALES[locale];
    const days = daysAgo(date, now);
    if (days <= 0) return date.toLocaleTimeString(tag, { hour: "2-digit", minute: "2-digit" });
    if (days === 1) return relativeDay(locale, 1);
    if (days < 7) return capitalize(date.toLocaleDateString(tag, { weekday: "short" }));
    if (date.getFullYear() === now.getFullYear()) return date.toLocaleDateString(tag, { day: "numeric", month: "short" });
    return formatDay(locale, date);
}

/** Время под сообщением: только часы и минуты (день — в разделителе) */
export const formatTime = (locale: Locale, iso: string | null | undefined): string => (iso ? new Date(iso).toLocaleTimeString(LOCALES[locale], { hour: "2-digit", minute: "2-digit" }) : "");

/** Разделитель дней в переписке: «Сегодня», «Вчера», «5 ноября», в прошлые годы — «5 ноября 2025 г.» */
export function formatDayLabel(locale: Locale, iso: string, now = new Date()): string {
    const date = new Date(iso);
    const days = daysAgo(date, now);
    if (days === 0 || days === 1) return relativeDay(locale, days);
    return date.toLocaleDateString(LOCALES[locale], date.getFullYear() === now.getFullYear() ? { day: "numeric", month: "long" } : { day: "numeric", month: "long", year: "numeric" });
}

/** "ГГГГ-ММ-ДД" → дата без часового пояса (иначе на западе страны дата съезжает на день) */
const parseDay = (value: string | null | undefined): Date | null => {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
    return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
};

/** Даты заявки коротко: «1–20 дек. 2026 г.», «28 дек. 2026 г. – 5 янв. 2027 г.»; без дат — "" */
export function formatDateRange(locale: Locale, start: string | null | undefined, end: string | null | undefined): string {
    const from = parseDay(start);
    const to = parseDay(end);
    if (!from) return "";
    const format = new Intl.DateTimeFormat(LOCALES[locale], { day: "numeric", month: "short", year: "numeric" });
    return to && to.getTime() !== from.getTime() ? format.formatRange(from, to) : format.format(from);
}

/** Вкладки над списком чатов (как в Worldpackers и почте) */
export type ChatTab = "all" | "unread" | "awaiting" | "accepted";
export const CHAT_TABS: ChatTab[] = ["all", "unread", "awaiting", "accepted"];

/** Последнее сообщение в чате от собеседника — ждёт ответа вошедшего */
export const awaitsReply = (chat: Chat, myId: string | undefined): boolean => !!chat.lastMessage && !!myId && chat.lastMessage.author?.id !== myId;

export function chatInTab(chat: Chat, tab: ChatTab, myId: string | undefined): boolean {
    switch (tab) {
        case "unread": return (chat.countUnreadMessages ?? 0) > 0;
        case "awaiting": return awaitsReply(chat, myId);
        case "accepted": return chat.application?.status === "accepted";
        default: return true;
    }
}

/** Статус заявки для плашки: у новой заявки организатор видит «Новая заявка», волонтёр — «Заявка отправлена» */
export type StatusChip = "incoming" | "sent" | "accepted" | "canceled";

export function statusChip(status: string | null | undefined, viewerIsVolunteer: boolean): StatusChip | null {
    if (status === "accepted" || status === "canceled") return status;
    if (status === "new") return viewerIsVolunteer ? "sent" : "incoming";
    return null;
}

/** Своё сообщение прочитано собеседником — две галочки */
export const readByOthers = (message: { author?: unknown; readByUserIds?: string[] | null }, myId: string | undefined): boolean =>
    !!myId && (message.readByUserIds ?? []).some((id) => id !== myId);

/** Подряд идущие сообщения одного автора в пределах 5 минут рисуются одной группой — без лишних отступов и хвостиков */
export const sameGroup = (a: { author?: string | null; createdAt?: string | null } | undefined, b: { author?: string | null; createdAt?: string | null } | undefined): boolean =>
    !!a && !!b && a.author === b.author && Math.abs(new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()) < 5 * 60_000;

const URL_REGEX = /(https?:\/\/[^\s<>"']+)/g;

const escapeHtml = (text: string) => text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Текст сообщения в HTML: всё экранируется, ссылки становятся <a>. URL
 * режется по границам до экранирования — иначе «'» и «>» превращаются в
 * сущности, и ссылка проглатывает следующее слово.
 */
export function linkify(text: string): string {
    return text
        .split(URL_REGEX)
        .map((part, index) => {
            const escaped = escapeHtml(part);
            if (index % 2 === 0) return escaped;
            return `<a href="${escaped}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;word-break:break-all;">${escaped}</a>`;
        })
        .join("");
}

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png"];

/** Вложение — картинка (показываем превью) или файл (ссылка на скачивание) */
export const isImageAttachment = (contentUrl: string): boolean => IMAGE_EXTENSIONS.includes((contentUrl.split("/").pop()?.split(".").pop() ?? "").toLowerCase());

/**
 * Ссылка на публичный профиль собеседника из шапки чата: у организатора без
 * профиля волонтёра (или если пишет волонтёр без организации) — страница
 * организации, иначе — профиль волонтёра (getCompanionProfileUrl старого фронта).
 */
export function companionTarget(companion: { id?: string; hostId?: string | null; volunteer?: unknown } | null | undefined, viewerIsHost: boolean):
    { kind: "organization"; id: string } | { kind: "volunteer"; id: string } | null {
    if (!companion?.id) return null;
    if (companion.hostId && (!companion.volunteer || !viewerIsHost)) return { kind: "organization", id: companion.hostId };
    return { kind: "volunteer", id: companion.id };
}

/**
 * Даты в форме заявки: «Прибытие» позже «Отъезда» сдвигает отъезд на ту же
 * дату; «Отъезд» раньше прибытия не принимается; без прибытия — сегодня
 * (TermsApplication старого фронта). Даты — "ГГГГ-ММ-ДД".
 */
export interface Terms { start: string | null; end: string | null }

export function setArrival(terms: Terms, start: string): Terms {
    if (!terms.end || start > terms.end) return { start, end: start };
    return { ...terms, start };
}

export function setDeparture(terms: Terms, end: string, today: string): Terms {
    if (!terms.start) return { start: today, end };
    if (end < terms.start) return terms;
    return { ...terms, end };
}
