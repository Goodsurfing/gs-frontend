"use client";

import { useRef } from "react";

import { SwiperArrow } from "@/components/gallery/SwiperArrow";
import { useScrollEdges } from "@/components/gallery/useScrollEdges";
import { Avatar } from "@/components/ui/Avatar";

export interface SliderReview { id: string; title: string; text: string; image?: string; author: string; avatar?: string; href: string }

/**
 * Лента отзывов по одному (ReviewSlider старого фронта): карточка с текстом
 * слева и фото справа, стрелки по краям (уже 576 px — без стрелок). Имя
 * автора ведёт на вакансию, о которой отзыв (в старом фронте — на
 * несуществующую страницу организации).
 */
export function HostReviewsSlider({ reviews, labels }: { reviews: SliderReview[]; labels: { prev: string; next: string } }) {
    const track = useRef<HTMLDivElement>(null);
    const edges = useScrollEdges(track);
    const go = (direction: 1 | -1) => {
        const node = track.current;
        if (node) node.scrollBy({ left: direction * node.clientWidth, behavior: "smooth" });
    };
    return (
        <div className="relative w-full px-[60px] down-sm:px-0">
            <div ref={track} className="flex snap-x snap-mandatory items-stretch gap-[40px] overflow-x-auto p-[15px] [scrollbar-width:none] max-[1024px]:gap-2.5 [&::-webkit-scrollbar]:hidden">
                {reviews.map((review) => (
                    <div key={review.id} className="flex w-full shrink-0 snap-start gap-x-10 gap-y-5 bg-white shadow-[0_5px_20px_rgb(14_29_39/20%)]">
                        <div className="flex w-full flex-col gap-[18px] p-9">
                            <h3 className="text-[18px] font-medium">{review.title}</h3>
                            <p className="text-[14px]">{review.text}</p>
                            <a href={review.href} className="flex items-center gap-2.5">
                                <Avatar src={review.avatar} name={review.author} size={30} />
                                <span className="text-primary">{review.author}</span>
                            </a>
                        </div>
                        {review.image && (
                            // eslint-disable-next-line @next/next/no-img-element -- фото из отзыва
                            <img src={review.image} alt="" className="w-full max-w-[50%] object-cover down-lg:hidden" />
                        )}
                    </div>
                ))}
            </div>
            <SwiperArrow direction="prev" label={labels.prev} disabled={edges.start} onClick={() => go(-1)} className="down-sm:hidden" />
            <SwiperArrow direction="next" label={labels.next} disabled={edges.end} onClick={() => go(1)} className="down-sm:hidden" />
        </div>
    );
}
