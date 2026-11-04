"use client";

import { useEffect, useState } from "react";

import type { HeroImage } from "@/lib/heroImages";

import { useOptionalSession } from "@/components/session/SessionProvider";

export interface HeroSlide {
    title: string;
    text: string;
    description: string;
    image: HeroImage;
    button: { text: string; href: string; signedInHref?: string };
    /** Подпись с картинкой ведёт на вход */
    descriptionHref?: string;
}

/**
 * Слайдер первого экрана (SliderSide старого фронта): слайды сменяются
 * затуханием раз в 7 секунд, точки внизу. Первый слайд зовёт в сообщество:
 * вошедшего — в каталог, гостя — на вход.
 *
 * Медленный интернет: фото — <img> в HTML (браузер начинает грузить сразу, а
 * не после CSS, как с фоном), первое — с высоким приоритетом; под ним размытое
 * превью из data URL, так что серого экрана нет. Слайдер не переключается на
 * слайд, фото которого ещё не загрузилось.
 */
export function HeroSlider({ slides, bulletLabel }: { slides: HeroSlide[]; /** «Слайд {{n}}» */ bulletLabel: string }) {
    const [active, setActive] = useState(0);
    const [loaded, setLoaded] = useState<boolean[]>(() => slides.map(() => false));
    const markLoaded = (index: number) => setLoaded((prev) => (prev[index] ? prev : prev.map((value, i) => (i === index ? true : value))));
    const session = useOptionalSession();
    const signedIn = session?.status === "user";

    useEffect(() => {
        const timer = setInterval(() => {
            setActive((index) => {
                const next = (index + 1) % slides.length;
                return loaded[next] ? next : index;
            });
        }, 7000);
        return () => clearInterval(timer);
    }, [slides.length, active, loaded]);

    return (
        <div className="relative h-full min-h-screen flex-1 overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.title}
                    aria-hidden={index !== active}
                    className={`absolute inset-0 flex min-h-screen w-full items-center bg-cover bg-center bg-no-repeat transition-opacity duration-300 before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:bg-[linear-gradient(90deg,rgba(8,24,38,0.58)_0%,rgba(8,24,38,0.42)_35%,rgba(8,24,38,0.16)_65%,rgba(8,24,38,0.06)_100%)] down-md:bg-center down-md:before:bg-[linear-gradient(180deg,rgba(8,24,38,0.62)_0%,rgba(8,24,38,0.5)_30%,rgba(8,24,38,0.3)_60%,rgba(8,24,38,0.18)_100%)] ${index === active ? "z-[1] opacity-100" : "pointer-events-none opacity-0"}`}
                    style={{ backgroundImage: `url(${slide.image.placeholder})` }}
                >
                    <picture>
                        <source media="(max-width: 768px)" srcSet={slide.image.mobile} />
                        <img
                            data-hero
                            src={slide.image.src}
                            alt=""
                            loading="eager"
                            fetchPriority={index === 0 ? "high" : "low"}
                            decoding="async"
                            onLoad={() => markLoaded(index)}
                            ref={(img) => {
                                if (img?.complete && img.naturalWidth > 0) markLoaded(index);
                            }}
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 down-md:object-center ${loaded[index] ? "opacity-100" : "opacity-0"}`}
                        />
                    </picture>
                    <div className="relative z-[2] flex flex-col gap-[30px] px-[50px] down-md:gap-[22px] down-md:px-6">
                        <h2 className="mb-2.5 text-[72px] leading-[100%] font-semibold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.45)] max-[1600px]:text-[48px] max-[1400px]:text-[32px] down-md:text-[36px]! down-md:leading-[1.08]">{slide.title}</h2>
                        <p className="text-[18px] leading-[130%] font-medium text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.4)] down-md:text-[22px] down-md:leading-[1.3]">{slide.text}</p>
                        <a href={slide.descriptionHref} className="relative z-[1] flex items-center gap-[30px] max-[1400px]:flex-col max-[1400px]:items-start">
                            {/* eslint-disable-next-line @next/next/no-img-element -- картинка-коллаж */}
                            <img src="/web/images/home/slider-volunteer.png" alt="" className="w-[100px]" />
                            <span className="text-[16px] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.4)] down-md:text-[18px] down-md:leading-[1.3]">{slide.description}</span>
                        </a>
                        <a
                            href={signedIn && slide.button.signedInHref ? slide.button.signedInHref : slide.button.href}
                            className="relative z-[1] w-fit rounded-[10px] border border-host bg-host px-[50px] py-3.5 text-center text-[1rem] leading-[1.375rem] text-white transition-colors hover:bg-white hover:text-host"
                        >
                            {slide.button.text}
                        </a>
                    </div>
                </div>
            ))}
            {/* Точки — внизу справа, как у Swiper старого фронта с его стилями */}
            <div className="absolute right-[45px] bottom-[53px] z-10 flex gap-[23px]">
                {slides.map((slide, index) => (
                    <button
                        key={slide.title}
                        type="button"
                        aria-label={bulletLabel.replace("{{n}}", String(index + 1))}
                        aria-current={index === active}
                        onClick={() => setActive(index)}
                        className={`h-2 w-2 cursor-pointer rounded-full bg-white ${index === active ? "opacity-100" : "opacity-60"}`}
                    />
                ))}
            </div>
        </div>
    );
}
