import type { TFunction } from "i18next";
import type { OfferOrganizationResponseStats } from "../model/types/offer";

/**
 * «Обычно отвечает в течение дня · Отвечает на 80% заявок».
 * Время ответа показываем, только если организация отвечает хотя бы на
 * половину заявок: иначе медиана по немногим ответам вводит в заблуждение.
 */
export const responseStatsText = (
    stats: OfferOrganizationResponseStats | null | undefined,
    t: TFunction,
): string | null => {
    if (!stats) return null;

    const parts: string[] = [];
    const hours = stats.medianReplyHours;
    if (hours !== null && stats.answeredPercent >= 50) {
        if (hours <= 1) {
            parts.push(t("personalOffer.Обычно отвечает в течение часа"));
        } else if (hours <= 24) {
            parts.push(t("personalOffer.Обычно отвечает в течение дня"));
        } else {
            parts.push(t("personalOffer.Обычно отвечает за N дней", { count: Math.ceil(hours / 24) }));
        }
    }
    parts.push(t("personalOffer.Отвечает на N процентов заявок", { percent: stats.answeredPercent }));

    return parts.join(" · ");
};
