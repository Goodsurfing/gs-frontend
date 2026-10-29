import type { ReactNode } from "react";

import { textSlice } from "@/lib/textSlice";

import { MaskIcon } from "./parts";

export interface OfferHeroLabels {
    status: string;
    reviewsCount: string;
    noReviews: string;
}

/**
 * Карточка вверху страницы вакансии (PersonalCard старого фронта): обложка
 * под затемнением, заголовок, статус, категории, адрес, отзывы и рейтинг;
 * внизу — стопка фото и кнопки. Без обложки — светлый фон и тёмный текст.
 */
export function OfferHero({ title, image, status, categories, address, reviews, rating, gallery, actions, labels }: {
    title: string;
    image?: string;
    status: string;
    categories: { id: number; name: string; color: string }[];
    address?: string;
    reviews: number;
    rating: number;
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
                        <div className={`w-fit rounded-[2px] px-1.5 py-0.5 text-[10px] text-white ${status === "active" ? "bg-primary" : status === "disabled" ? "bg-error" : ""}`}>
                            {labels.status}
                        </div>
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
                            {reviews > 0 ? (
                                <>
                                    <p className={tone}>{labels.reviewsCount} {reviews}</p>
                                    <div className="flex items-start gap-1.5 text-[14px] leading-[120%] font-medium">
                                        <MaskIcon name="hero-star" className="h-[13px] w-[13px] text-[#FED81C]" />
                                        <span className={tone}>{rating}</span>
                                    </div>
                                </>
                            ) : (
                                <p className={tone}>{labels.noReviews}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex h-full flex-col justify-end">{gallery}</div>
                </div>
                <div className="flex h-fit flex-wrap justify-between gap-[15px] self-end">{actions}</div>
            </div>
        </div>
    );
}
