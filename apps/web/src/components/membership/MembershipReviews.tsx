"use client";

import { useRef, useState } from "react";

import { SwiperArrow } from "@/components/gallery/SwiperArrow";
import { useScrollEdges } from "@/components/gallery/useScrollEdges";
import { Avatar } from "@/components/ui/Avatar";

export interface MembershipReview { id: string; title: string; text: string; image: string; author: string; avatar?: string }

// Длинный отзыв листается кусками, как в старом фронте
const PAGE_CHARS = 1033;

function Slide({ review, labels }: { review: MembershipReview; labels: { prev: string; next: string } }) {
    const [from, setFrom] = useState(0);
    const canPrev = from > 0;
    const canNext = from + PAGE_CHARS < review.text.length;
    const arrow = (direction: "prev" | "next", enabled: boolean, onClick: () => void) => (
        <button type="button" aria-label={direction === "prev" ? labels.prev : labels.next} disabled={!enabled} onClick={onClick} className="box-content shrink-0 cursor-pointer p-2.5 select-none disabled:cursor-default disabled:opacity-20">
            {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
            <img src="/web/icons/review-right-icon.svg" alt="" className={`block h-2 w-[18px] ${direction === "prev" ? "-scale-x-100" : ""}`} />
        </button>
    );
    return (
        <div className="mx-auto flex h-[400px] w-full max-w-[980px] gap-10 bg-white down-lg:h-auto max-[756px]:flex-col max-[756px]:gap-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- фото из отзыва */}
            <img src={review.image} alt="review" className="w-full max-w-[480px] object-cover down-lg:max-w-[350px] max-[756px]:max-h-[250px] max-[756px]:!max-w-none" />
            <div className="flex h-full flex-col gap-2.5 pt-10 pb-5">
                <div className="flex items-center justify-between">
                    <h3 className="max-w-[350px] text-[1.125rem] font-medium">{review.title}</h3>
                    <div className="flex shrink-0 gap-[15px]">
                        {arrow("prev", canPrev, () => setFrom(from - PAGE_CHARS))}
                        {arrow("next", canNext, () => setFrom(from + PAGE_CHARS))}
                    </div>
                </div>
                <div className="mt-[17px] text-[0.75rem] font-medium"><p>{review.text.slice(from, from + PAGE_CHARS)}</p></div>
                <div className="mt-auto flex items-center gap-2.5">
                    <Avatar src={review.avatar || "/web/images/default-avatar.jpg"} name={review.author} size={30} />
                    <span className="text-[0.875rem] font-medium text-primary">{review.author}</span>
                </div>
            </div>
        </div>
    );
}

/** «Отзывы» на странице членства (Review старого фронта): по одному, стрелки по бокам */
export function MembershipReviews({ title, reviews, labels }: {
    title: string;
    reviews: MembershipReview[];
    labels: { prev: string; next: string; textPrev: string; textNext: string };
}) {
    const track = useRef<HTMLDivElement>(null);
    const edges = useScrollEdges(track);
    const go = (direction: 1 | -1) => {
        const node = track.current;
        if (node) node.scrollBy({ left: direction * node.clientWidth, behavior: "smooth" });
    };
    if (reviews.length === 0) return null;
    return (
        <section className="relative mx-auto mt-20 max-w-[1150px]">
            <h2 className="mx-auto text-center text-[1.5em] font-bold">{title}</h2>
            <div className="relative mt-10 down-lg:px-10 down-sm:px-2.5">
                <div ref={track} className="flex snap-x snap-mandatory gap-[50px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {reviews.map((review) => (
                        <div key={review.id} className="w-full shrink-0 snap-center">
                            <Slide review={review} labels={{ prev: labels.textPrev, next: labels.textNext }} />
                        </div>
                    ))}
                </div>
                <SwiperArrow direction="prev" label={labels.prev} disabled={edges.start} onClick={() => go(-1)} />
                <SwiperArrow direction="next" label={labels.next} disabled={edges.end} onClick={() => go(1)} />
            </div>
        </section>
    );
}
