import { mediaUrl } from "@/lib/media";
import type { SimilarOffer } from "@/lib/offer";

/**
 * «Даты этой вакансии прошли» (GS-277): у вакансии есть периоды заезда, и все закончились.
 * Откликнуться можно (кнопки остаются), но рядом — до четырёх похожих проектов с актуальными
 * датами. Похожие приходят вместе со страницей (сервер), поэтому отдельной загрузки нет;
 * не пришли — только ссылка на каталог. Превью — small, место под картинку зарезервировано.
 */
export function OfferDatesPassed({ similar, offerHref, catalogHref, labels }: {
    similar: SimilarOffer[];
    offerHref: (id: number) => string;
    catalogHref: string;
    labels: { title: string; text: string; similar: string; all: string; noAddress: string };
}) {
    return (
        <section role="note" aria-labelledby="offer-dates-passed" className="mb-8 rounded-[10px] bg-notice-bg px-5 py-4 text-[15px] leading-[140%] text-ink-secondary">
            <div className="flex items-start gap-3">
                <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-notice" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                <div>
                    <p id="offer-dates-passed" className="font-medium text-ink">{labels.title}</p>
                    <p className="mt-1">{labels.text}</p>
                </div>
            </div>
            {similar.length > 0 && (
                <>
                    <p className="mt-4 font-medium text-ink">{labels.similar}</p>
                    <ul className="mt-3 grid grid-cols-2 gap-3 down-md:grid-cols-1">
                        {similar.map((item) => (
                            <li key={item.id}>
                                <a href={offerHref(item.id)} className="flex h-full items-center gap-3 rounded-[10px] bg-white p-2.5 text-inherit no-underline transition-shadow hover:shadow-line">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- превью small из хранилища, размер зарезервирован */}
                                    <img
                                        src={mediaUrl(item.image, "small") ?? "/web/images/default-offer.png"}
                                        alt=""
                                        width={64}
                                        height={64}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-16 w-16 shrink-0 rounded-[8px] bg-field object-cover"
                                    />
                                    <span className="min-w-0">
                                        <span className="line-clamp-2 font-medium text-ink">{item.title}</span>
                                        <span className="mt-0.5 block truncate text-[13px] text-caption">{item.address || labels.noAddress}</span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <a href={catalogHref} className="mt-4 inline-block text-primary underline">{labels.all}</a>
        </section>
    );
}
