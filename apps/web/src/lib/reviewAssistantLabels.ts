import type { ReviewAssistantLabels } from "@/components/cabinet/volunteer/ReviewAssistant";

/** Подписи помощника отзыва (GS-256) из словаря volunteer: «Мои заявки» и «Отзывы» волонтёра */
export const reviewAssistantLabels = (tv: (key: string) => string): ReviewAssistantLabels => ({
    title: tv("reviewAssistant.title"),
    write: tv("reviewAssistant.write"),
    writing: tv("reviewAssistant.writing"),
    hint: tv("reviewAssistant.hint"),
    limit: tv("reviewAssistant.limit"),
    failed: tv("reviewAssistant.failed"),
    good: tv("reviewAssistant.good").split("|"),
    bad: tv("reviewAssistant.bad").split("|"),
});
