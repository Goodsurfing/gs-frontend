import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { mediaUrl } from "@/lib/media";
import { localizedDescription, getOffer } from "@/lib/offer";
import { offerHighlights } from "@/lib/offerHighlights";
import { offerPlace } from "@/lib/offerSeo";
import { offerPostImage, offerStoryImage } from "@/lib/shareCard";

type Context = { params: Promise<{ locale: string; id: string }> };

/**
 * Картинка вакансии для соцсетей: /offers/:id/card — для поста и превью ссылки
 * (1200×630, её же указывает og:image страницы), ?format=story — для сторис
 * (1080×1920). Черновик и несуществующая вакансия — 404.
 */
export async function GET(request: Request, { params }: Context) {
    const { locale, id } = await params;
    if (!isLocale(locale)) return new Response(null, { status: 404 });
    const [result, tOffer] = await Promise.all([getOffer(locale, id), getTranslator(locale, "offer")]);
    if (result.kind !== "ok" || result.offer.status === "draft") return new Response(null, { status: result.kind === "error" ? 503 : 404 });
    const { offer } = result;
    const { description } = localizedDescription(offer);
    const data = {
        title: description?.title || "Гудсёрфинг",
        place: offerPlace(offer.where?.address),
        highlights: offerHighlights({ condition: offer.condition, whatToDo: offer.whatToDo, when: offer.when }, tOffer),
        image: mediaUrl(description?.image, "large"),
        site: "goodsurfing.org",
        cta: tOffer("share.card-cta"),
    };
    return new URL(request.url).searchParams.get("format") === "story" ? offerStoryImage(data) : offerPostImage(data);
}
