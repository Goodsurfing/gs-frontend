/**
 * Стрелка как у навигации Swiper (старый фронт): 44×44, синяя (#007aff),
 * на краю ленты — полупрозрачная и неактивная.
 */
export function SwiperArrow({ direction, label, disabled, onClick, className = "" }: {
    direction: "prev" | "next";
    label: string;
    disabled: boolean;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className={`absolute top-1/2 z-10 -mt-[22px] flex h-11 w-11 cursor-pointer items-center justify-center text-[#007aff] disabled:pointer-events-none disabled:opacity-35 ${direction === "prev" ? "left-1" : "right-1"} ${className}`}
        >
            <svg aria-hidden width="11" height="20" viewBox="0 0 11 20" fill="none" className={`h-full w-full ${direction === "prev" ? "rotate-180" : ""}`}>
                <path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor" />
            </svg>
        </button>
    );
}
