import type { Locale } from "@/i18n/config";
import type { Translate } from "@/i18n/dictionary";
import { categoryName } from "@/lib/categories";
import { mediaUrl } from "@/lib/media";
import type { OfferCardData } from "@/lib/offers";
import { routes } from "@/lib/routes";
import { textSlice } from "@/lib/textSlice";

/**
 * Карточка вакансии в слайдере (как widgets/OffersSlider/ui/Offer старого
 * фронта). Подписи «Отзывов» и «Отправилось» в старом фронте не переводились —
 * оставлены как есть, перевод — отдельной правкой вместе со старым фронтом.
 */
export function OfferCard({ offer, locale, t }: { offer: OfferCardData; locale: Locale; t: Translate }) {
    const rating = Number(offer.averageRating) || 0;
    const category = categoryName(offer.categories[0]?.name, t) ?? "Без категории";

    return (
        <a
            href={routes.offer(locale, offer.id)}
            className="box-border flex min-h-[438px] max-w-[347px] cursor-pointer flex-col justify-around border border-accent-bg px-[19px] py-[21px] text-inherit no-underline shadow-line down-lg:max-w-none"
        >
            {/* eslint-disable-next-line @next/next/no-img-element -- превью из хранилища, размеры задаёт карточка */}
            <img
                src={mediaUrl(offer.image, "medium") ?? "/web/images/default-offer.png"}
                alt={offer.title}
                loading="lazy"
                className="h-[220px] w-full object-cover"
            />
            <div>
                <h4 className="mt-[25px] mb-2.5 h-11 text-[1.125rem] leading-[122%] font-medium">{textSlice(offer.title, 30, "Без заголовка")}</h4>
                <p className="text-[0.875rem] leading-[143%] text-ink opacity-50">{textSlice(offer.address, 30, "Без адреса")}</p>
                <p className="mt-0.5 text-[0.875rem] leading-[143%] text-ink opacity-50">{category}</p>
            </div>
            <div className="mt-[18px] flex flex-wrap items-center gap-2.5 down-xs:flex-col down-xs:items-start">
                {rating ? (
                    <div className="flex items-center">
                        <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="#FFC107">
                            <path fillRule="evenodd" clipRule="evenodd" d="M7 11.1684L2.8855 13.3315L3.6713 8.74999L0.342604 5.50531L4.94275 4.83687L7 0.668427L9.05725 4.83687L13.6574 5.50531L10.3287 8.74999L11.1145 13.3315L7 11.1684Z" />
                        </svg>
                        <span className="ml-[5px]">{rating}</span>
                    </div>
                ) : null}
                {offer.reviewsCount ? (
                    <div className="down-xs:mt-2.5"><span>Отзывов: {offer.reviewsCount}</span></div>
                ) : null}
                <div className="down-xs:mt-2.5"><span>Отправилось: {offer.acceptedApplicationsCount}</span></div>
            </div>
        </a>
    );
}
