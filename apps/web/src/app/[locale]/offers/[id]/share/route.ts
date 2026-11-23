import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getOffer, localizedDescription } from "@/lib/offer";
import { offerHighlights } from "@/lib/offerHighlights";
import { offerPlace } from "@/lib/offerSeo";
import type { OfferShareFacts } from "@/lib/share";

type Context = { params: Promise<{ locale: string; id: string }> };

/**
 * Факты вакансии для текста поста (окно «Поделиться» в кабинете организатора и
 * у волонтёра): название, регион, главное кратко на языке страницы — собираются
 * здесь, чтобы не тащить в браузер словари условий.
 */
export async function GET(_request: Request, { params }: Context) {
    const { locale, id } = await params;
    if (!isLocale(locale)) return Response.json(null, { status: 404 });
    const [result, tOffer] = await Promise.all([getOffer(locale, id), getTranslator(locale, "offer")]);
    if (result.kind !== "ok") return Response.json(null, { status: result.kind === "error" ? 503 : 404 });
    const { offer } = result;
    const facts: OfferShareFacts = {
        title: localizedDescription(offer).description?.title || "",
        place: offerPlace(offer.where?.address),
        highlights: offerHighlights({ condition: offer.condition, whatToDo: offer.whatToDo, when: offer.when }, tOffer),
    };
    return Response.json(facts, { headers: { "Cache-Control": "public, max-age=300" } });
}
