"use client";

import { useEffect, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";

export interface ShowcaseReview { id: string; title: string; text: string; image: string; author: string; avatar?: string; href: string }

/**
 * Отзывы на главной (ReviewsContainer старого фронта): по одному, сменяются
 * раз в 2 секунды (пауза под мышью), стрелки вверху справа; карточка целиком
 * ведёт на вакансию.
 */
export function ReviewsShowcase({ reviews, labels }: { reviews: ShowcaseReview[]; labels: { prev: string; next: string } }) {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const last = reviews.length - 1;

    useEffect(() => {
        if (paused || active >= last) return;
        const timer = setTimeout(() => setActive((index) => Math.min(index + 1, last)), 2000);
        return () => clearTimeout(timer);
    }, [active, paused, last]);

    if (reviews.length === 0) return null;
    const arrow = (direction: -1 | 1) => {
        const disabled = direction === -1 ? active === 0 : active === last;
        return (
            <button
                type="button"
                aria-label={direction === -1 ? labels.prev : labels.next}
                disabled={disabled}
                onClick={() => setActive(active + direction)}
                className={`cursor-pointer disabled:cursor-default disabled:opacity-20 ${direction === -1 ? "mr-[15px] rotate-180" : ""}`}
            >
                {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                <img src="/web/images/home/review-arrow.svg" alt="" />
            </button>
        );
    };

    return (
        <div className="max-w-[980px] rounded-[2px] bg-[rgb(0_0_0/0.01%)] shadow-[0_5px_20px_rgb(14_29_39/5%)] down-lg:w-[90%]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className="relative">
                <div className="absolute top-[34px] right-10 z-[999] flex items-center down-lg:hidden">
                    {arrow(-1)}
                    {arrow(1)}
                </div>
                <div className="grid">
                    {reviews.map((review, index) => (
                        <a
                            key={review.id}
                            href={review.href}
                            aria-hidden={index !== active}
                            tabIndex={index === active ? 0 : -1}
                            className={`col-start-1 row-start-1 flex cursor-pointer rounded-[10px] bg-white shadow-[0_5px_20px_rgb(14_29_39/5%)] transition-opacity duration-300 ${index === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element -- фото из отзыва */}
                            <img src={review.image} alt={review.title} loading="lazy" className="h-[400px] w-[480px] shrink-0 object-cover down-lg:hidden" />
                            <div className="flex flex-col justify-between px-5 pt-[30px] pb-5 down-lg:w-full down-lg:items-center">
                                <h3 className="line-clamp-2 pr-[90px] text-[1.125rem] leading-[122%] font-medium text-ink-secondary down-lg:pr-0 down-lg:text-center">{review.title}</h3>
                                <p className="line-clamp-6 max-w-[420px] text-[0.8125rem] leading-[146%] text-ink-secondary down-lg:mt-5 down-lg:mb-10 down-lg:text-center">{review.text}</p>
                                <div className="flex items-center">
                                    <Avatar src={review.avatar} name={review.author} size={30} />
                                    <p className="ml-2.5 text-[0.825rem] font-semibold text-primary">{review.author}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
