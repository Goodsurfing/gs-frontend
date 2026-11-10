import type { ReactNode } from "react";

import { textSlice } from "@/lib/textSlice";

import { MaskIcon } from "./parts";

export interface OfferHeroLabels {
    status: string;
    reviewsCount: string;
}

/**
 * Карточка вверху страницы вакансии (PersonalCard старого фронта): обложка
 * под затемнением, заголовок, статус, категории, адрес, отзывы и рейтинг;
 * внизу — стопка фото и кнопки. Без обложки — светлый фон и тёмный текст.
 * Так же устроена карточка сбора (HeaderDonationCard) — со своими показателями.
 *
 * Первый экран — только то, по чему решают «ехать или нет» (10.11.2026): статус показываем, лишь
 * когда он не «активный» (посетителю «Активный» ничего не говорит), «Пока нет отзывов» не пишем
 * (у большинства вакансий отзывов нет — это минус на самом видном месте), даты — первой пометкой.
 */
export function OfferHero({ title, image, status, categories, address, reviews, rating, stats, dates, highlights = [], gallery, actions, labels }: {
    title: string;
    image?: string;
    status: string;
    categories: { id: number; name: string; color: string }[];
    address?: string;
    reviews?: number;
    rating?: number;
    /** Вместо отзывов и рейтинга — свои показатели (у сбора: поддержавшие, собрано, дней осталось) */
    stats?: (tone: string) => ReactNode;
    /** Когда: ближайшие даты, «Круглый год» или «Даты прошли» (предупреждение) — первой пометкой */
    dates?: { text: string; passed: boolean } | null;
    /** «Главное кратко»: жильё, питание, часы, срок (вакансия) */
    highlights?: string[];
    gallery: ReactNode;
    actions: ReactNode;
    labels: OfferHeroLabels;
}) {
    const tone = image ? "text-white" : "text-ink-secondary";
    return (
        <div className="relative isolate flex min-h-[500px] w-full flex-wrap items-stretch overflow-hidden rounded-[10px]">
            <div
                aria-hidden
                className="absolute -z-10 h-full min-h-[560px] w-full rounded-[10px] bg-cover bg-center bg-no-repeat"
                style={image
                    ? { backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), url(${JSON.stringify(image)})`, backgroundColor: "lightgray" }
                    : { background: "#ECF1F4" }}
            />
            <div className="flex w-full flex-wrap justify-between gap-[15px] px-[60px] py-10 down-lg:p-5 down-md:px-2.5 down-md:py-10">
                <div className="flex flex-col justify-between gap-[140px] down-md:gap-[30px]">
                    <div className="flex max-w-[1080px] flex-col flex-wrap gap-5">
                        <h1 className={`text-[40px] leading-[120%] font-semibold break-words down-md:text-[26px] ${tone}`}>{textSlice(title, 220, "title")}</h1>
                        {status !== "active" && labels.status && (
                            <div className={`w-fit rounded-[2px] px-1.5 py-0.5 text-[10px] text-white ${status === "disabled" ? "bg-error" : "bg-caption"}`}>
                                {labels.status}
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-2.5">
                                {categories.map((category) => (
                                    <span
                                        key={category.id}
                                        style={{ backgroundColor: category.color }}
                                        className="flex cursor-default items-center justify-center rounded-[17px] px-3 py-2.5 text-center text-[14px] leading-none text-ink"
                                    >
                                        {category.name}
                                    </span>
                                ))}
                            </div>
                            <span className={`text-[14px] leading-[120%] font-medium ${tone}`}>{address}</span>
                            {(dates || highlights.length > 0) && (
                                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                                    {dates && (
                                        <li className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] leading-none font-medium ${dates.passed ? "bg-notice-bg text-ink" : image ? "bg-white text-ink" : "bg-white text-ink-secondary"}`}>
                                            <svg aria-hidden viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${dates.passed ? "text-notice" : "text-primary"}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                                            {dates.text}
                                        </li>
                                    )}
                                    {highlights.map((item) => (
                                        <li key={item} className={`rounded-full px-3 py-1.5 text-[13px] leading-none font-medium ${image ? "bg-white/20 text-white backdrop-blur-[2px]" : "bg-white text-ink-secondary"}`}>{item}</li>
                                    ))}
                                </ul>
                            )}
                            {stats ? stats(tone) : reviews ? (
                                <div className={`flex items-center gap-1.5 text-[14px] leading-[120%] font-medium ${tone}`}>
                                    <MaskIcon name="hero-star" className="h-[13px] w-[13px] text-[#FED81C]" />
                                    <span>{rating}</span>
                                    <span className="opacity-80">· {labels.reviewsCount} {reviews}</span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex h-full flex-col justify-end">{gallery}</div>
                </div>
                <div className="flex h-fit flex-wrap justify-between gap-[15px] self-end">{actions}</div>
            </div>
        </div>
    );
}
