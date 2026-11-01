"use client";

/** Зелёная кнопка, плавно прокручивающая к разделу (с запасом 60 px под шапку) — «Выбрать курс», «Начать обучение» */
export function ScrollToButton({ target, label, className = "" }: { target: string; label: string; className?: string }) {
    const scroll = () => {
        const element = document.getElementById(target);
        if (!element) return;
        window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 60, behavior: "smooth" });
    };
    return (
        <button
            type="button"
            onClick={scroll}
            className={`flex w-max cursor-pointer items-center justify-center rounded-[10px] border border-cta bg-cta px-[100px] py-3 text-center text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-cta down-lg:px-[15px] ${className}`}
        >
            {label}
        </button>
    );
}
