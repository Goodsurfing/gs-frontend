// Звёзды MUI Rating старого фронта: выбранная — Star, пустая — контур StarBorder
export const STAR = "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
export const STAR_BORDER = "m22 9.24-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z";

/**
 * Оценка только для чтения (Rating readOnly MUI старого фронта): пять звёзд,
 * значение округляется до целой звезды, как precision=1 у MUI.
 */
export function StarRating({ value, size = 24, label }: { value: number; size?: number; label?: string }) {
    const filled = Math.round(value);
    return (
        <span role="img" aria-label={label ?? String(value)} className="inline-flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} aria-hidden viewBox="0 0 24 24" style={{ width: size, height: size }} className={`block fill-current ${star <= filled ? "text-[#FED81C]" : "text-black/26"}`}>
                    <path d={star <= filled ? STAR : STAR_BORDER} />
                </svg>
            ))}
        </span>
    );
}
