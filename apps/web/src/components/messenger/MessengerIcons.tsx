// Значки — встроенным SVG с заливкой currentColor. Раньше были CSS-маской из файлов, где у фигуры
// fill="none": маска выходила пустой, и стрелки отправки и крестика вложения не было видно ни в одном
// браузере (тестировщица, 27.11: «отправить не могу — нет кнопки»)
export function SendArrowIcon({ className }: { className?: string }) {
    return (
        <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
            <path d="M3 13H9V11H3V1.85C3 1.47 3.41 1.23 3.74 1.41L22.2 11.56C22.55 11.75 22.55 12.25 22.2 12.44L3.74 22.59C3.41 22.77 3 22.53 3 22.15V13Z" />
        </svg>
    );
}

export function CloseIcon({ className }: { className?: string }) {
    return (
        <svg aria-hidden viewBox="0 0 14 14" className={className} fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" />
        </svg>
    );
}
};
