"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef } from "react";

import { SwiperArrow } from "./SwiperArrow";
import { useScrollEdges } from "./useScrollEdges";

/**
 * Просмотр фото галереи во весь экран (как ModalGallery старого фронта):
 * затемнение, крестик, листание стрелками, клавишами ← → и свайпом.
 */
export function GalleryLightbox({ images, index, onClose, labels }: {
    images: string[];
    index: number | null;
    onClose: () => void;
    labels: { close: string; prev: string; next: string; photo: string };
}) {
    const track = useRef<HTMLDivElement>(null);
    const edges = useScrollEdges(track);

    // Открыть на выбранном фото без анимации прокрутки
    useEffect(() => {
        if (index === null) return;
        requestAnimationFrame(() => {
            const node = track.current;
            if (node) node.scrollTo({ left: index * node.clientWidth, behavior: "instant" });
        });
    }, [index]);

    const go = (direction: 1 | -1) => {
        const node = track.current;
        if (node) node.scrollBy({ left: direction * node.clientWidth, behavior: "smooth" });
    };

    return (
        <Dialog.Root open={index !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in justify-center overflow-y-auto bg-black/50 py-10">
                    <Dialog.Content
                        className="relative self-center outline-none"
                        aria-describedby={undefined}
                        onKeyDown={(event) => {
                            if (event.key === "ArrowLeft") go(-1);
                            if (event.key === "ArrowRight") go(1);
                        }}
                    >
                        <Dialog.Title className="sr-only">{labels.photo}</Dialog.Title>
                        <Dialog.Close aria-label={labels.close} className="absolute top-0 -right-10 z-20 cursor-pointer text-white down-md:top-[-12%] down-md:right-[5%]">
                            <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="block">
                                <path fillRule="evenodd" clipRule="evenodd" d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" />
                            </svg>
                        </Dialog.Close>
                        <div className="relative mx-auto w-[80vw] max-w-[1600px] down-md:w-screen">
                            <div ref={track} className="flex snap-x snap-mandatory items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {images.map((src, i) => (
                                    <div key={src} className="w-full shrink-0 snap-start">
                                        {/* eslint-disable-next-line @next/next/no-img-element -- фото из хранилища */}
                                        <img src={src} alt={`${labels.photo} ${i + 1}`} className="mx-auto block max-h-[calc(80vh-100px)] w-full object-contain" />
                                    </div>
                                ))}
                            </div>
                            <SwiperArrow direction="prev" label={labels.prev} disabled={edges.start} onClick={() => go(-1)} />
                            <SwiperArrow direction="next" label={labels.next} disabled={edges.end} onClick={() => go(1)} />
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
