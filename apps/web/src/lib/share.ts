import type { Locale } from "@/i18n/config";

/**
 * «Поделиться» вакансией и значок организатора (привлечение через организаторов
 * и волонтёров, 07.11.2026): ссылки с меткой, чтобы в Метрике было видно, сколько
 * людей пришло из публикаций, готовый текст поста и ссылки на соцсети.
 */

/** Кто поделился: организатор из кабинета, волонтёр после принятой заявки, значок на сайте организатора */
export type ShareSource = "host" | "volunteer" | "badge";

export type ShareChannel = "vk" | "telegram" | "whatsapp";

/** Ссылка с меткой Метрики: utm_source=share, utm_medium — кто поделился, utm_campaign — что */
export function withShareMark(url: string, source: ShareSource, campaign: "offer" | "organization" = "offer"): string {
    const target = new URL(url);
    target.searchParams.set("utm_source", "share");
    target.searchParams.set("utm_medium", source);
    target.searchParams.set("utm_campaign", campaign);
    return target.toString();
}

/** Ссылки «поделиться» в соцсетях; MAX своей ссылки не даёт — туда текст копируют */
export function shareLinks(url: string, text: string): Record<ShareChannel, string> {
    return {
        vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
    };
}

export interface OfferShareFacts {
    title: string;
    place: string | null;
    /** Главное кратко: жильё, питание, часы, срок */
    highlights: string[];
}

const TEXTS: Record<Locale, { host: string; volunteer: string; apply: string }> = {
    ru: { host: "Ищем волонтёров", volunteer: "Еду волонтёром", apply: "Подробности и отклик" },
    en: { host: "We are looking for volunteers", volunteer: "I'm going volunteering", apply: "Details and how to apply" },
    es: { host: "Buscamos voluntarios", volunteer: "Me voy de voluntariado", apply: "Detalles y solicitud" },
};

/**
 * Готовый текст поста. Организатор — «Ищем волонтёров», волонтёр — «Еду волонтёром».
 * Ссылку соцсети добавляют сами (VK, Telegram), в WhatsApp и для копирования — дописываем.
 */
export function offerShareText(facts: OfferShareFacts, source: "host" | "volunteer", locale: Locale): string {
    const t = TEXTS[locale];
    const lines = [
        `${source === "host" ? "🌿" : "🎒"} ${source === "host" ? t.host : t.volunteer}: ${facts.title.trim()}`,
        facts.place ? `📍 ${facts.place}` : null,
        facts.highlights.length > 0 ? `✅ ${facts.highlights.join(" · ")}` : null,
    ];
    return lines.filter((line): line is string => !!line).join("\n");
}

/** Текст для копирования (MAX, Instagram, куда угодно): пост + ссылка */
export function offerShareCopy(text: string, url: string, locale: Locale): string {
    return `${text}\n${TEXTS[locale].apply}: ${url}`;
}

/** Код значка «Мы на Гудсёрфинге» для сайта организатора */
export function badgeHtml({ pageUrl, imageUrl, name }: { pageUrl: string; imageUrl: string; name: string }): string {
    const alt = `${name} на Гудсёрфинге`.replace(/"/g, "&quot;");
    return `<a href="${pageUrl}" target="_blank" rel="noopener"><img src="${imageUrl}" alt="${alt}" width="300" height="100" style="border:0"></a>`;
}
