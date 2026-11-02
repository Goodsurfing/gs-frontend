"use client";

/** Звёзды MUI Rating, их рисовал старый фронт: залитая (Star) и контур (StarBorder) для пустых */
const STAR = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
const STAR_BORDER = "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z";

function Star({ size, filled }: { size: number; filled: boolean }) {
    return (
        <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" className={filled ? "fill-[#FED81C]" : "fill-black/26"}>
            <path d={filled ? STAR : STAR_BORDER} />
        </svg>
    );
}

/**
 * Звёзды оценки (Rating MUI старого фронта): только показ — значение
 * округляется до целого, как при precision=1; с onChange — выбор 1–5,
 * повторное нажатие на ту же звезду снимает оценку.
 */
export function StarRating({ value, size = 24, label, onChange }: {
    value: number | null;
    size?: number;
    label: string;
    onChange?: (value: number | null) => void;
}) {
    const shown = Math.round(value ?? 0);
    if (!onChange) {
        return (
            <span role="img" aria-label={`${label}: ${value ?? 0}`} className="inline-flex">
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={size} filled={star <= shown} />)}
            </span>
        );
    }
    return (
        <div role="radiogroup" aria-label={label} className="inline-flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={value === star}
                    aria-label={String(star)}
                    onClick={() => onChange(value === star ? null : star)}
                    className="cursor-pointer border-0 bg-transparent p-0"
                >
                    <Star size={size} filled={star <= shown} />
                </button>
            ))}
        </div>
    );
}
