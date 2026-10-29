"use client";

import * as Dialog from "@radix-ui/react-dialog";

/**
 * Превью картинки, по клику — она же крупно в модальном окне (как Modal
 * старого фронта: затемнение, крестик справа сверху). Radix Dialog даёт
 * фокус внутри окна, закрытие по Esc и role="dialog".
 */
export function ImageLightbox({ src, alt, closeLabel, className = "" }: {
    src: string;
    alt: string;
    closeLabel: string;
    className?: string;
}) {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button type="button" className={`block cursor-pointer ${className}`} aria-label={alt}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- статичные сканы документов, размеры как в старом фронте */}
                    <img src={src} alt={alt} className="block w-full object-cover" />
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in justify-center overflow-y-auto bg-black/50 py-10">
                    <Dialog.Content className="relative self-center outline-none" aria-describedby={undefined}>
                        <Dialog.Title className="sr-only">{alt}</Dialog.Title>
                        <Dialog.Close
                            aria-label={closeLabel}
                            className="absolute top-0 -right-10 cursor-pointer text-white down-md:top-[-12%] down-md:right-[5%]"
                        >
                            <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="block">
                                <path fillRule="evenodd" clipRule="evenodd" d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" />
                            </svg>
                        </Dialog.Close>
                        {/* eslint-disable-next-line @next/next/no-img-element -- см. выше */}
                        <img src={src} alt="" className="block max-h-[80dvh] w-full object-cover" />
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
