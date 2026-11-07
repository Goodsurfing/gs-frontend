import type { Translate } from "@/i18n/dictionary";

import type { OfferShareLabels } from "@/components/share/OfferShareDialog";

/** Тексты окна «Поделиться вакансией» (словарь offer, раздел share) */
export const offerShareLabels = (tOffer: Translate, intro: "intro-host" | "intro-volunteer" = "intro-host"): OfferShareLabels => ({
    title: tOffer("share.title"),
    intro: tOffer(`share.${intro}`),
    text: tOffer("share.text"),
    copy: tOffer("share.copy"),
    copied: tOffer("share.copied"),
    downloadPost: tOffer("share.download-post"),
    downloadStory: tOffer("share.download-story"),
    maxHint: tOffer("share.max-hint"),
    close: tOffer("share.close"),
    error: tOffer("share.error"),
});
