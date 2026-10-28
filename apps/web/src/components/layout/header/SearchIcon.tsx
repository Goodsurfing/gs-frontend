/** Лупа из кнопки «Все вакансии» (shared/assets/icons/search-icon.svg старого фронта). */
export function SearchIcon({ className = "" }: { className?: string }) {
    return (
        <svg aria-hidden viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
            <path d="M11.2188 11.2192L16.9996 17.0001M7.1315 13.263C10.5178 13.263 13.263 10.5178 13.263 7.1315C13.263 3.74517 10.5178 1 7.1315 1C3.74517 1 1 3.74517 1 7.1315C1 10.5178 3.74517 13.263 7.1315 13.263Z" />
        </svg>
    );
}
