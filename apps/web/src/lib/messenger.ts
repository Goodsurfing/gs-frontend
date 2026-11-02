import type { components } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";

/** Чат в списке и в шапке (GET /api/v1/personal/chats, /api/v1/chats/{id}) */
export type Chat = components["schemas"]["Chat-chat.read_organization.short_message.read_volunteer.read-with-profile_user.short_media_object.read"];
export type ChatParticipant = NonNullable<Chat["otherParticipants"]>[number];
/** Сообщение; в событии Mercure есть ещё IRI чата */
export type ChatMessage = components["schemas"]["Message-message.read"] & { chat?: string };
export type ApplicationStatus = "new" | "accepted" | "canceled";

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
        return {
            ...chat,
            lastMessage: { ...chat.lastMessage, ...message, author: chat.lastMessage.author } as Chat["lastMessage"],
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

/** Дата-разделитель в переписке (formatDate старого фронта) */
export function formatDay(locale: Locale, value: string | Date): string {
    return new Date(value).toLocaleDateString(LOCALES[locale], { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/[-/]/g, ".");
}

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
