/** Малый индикатор загрузки (MiniLoader старого фронта — CircularProgress MUI 40 px), по центру строки */
export function Spinner({ label = "Загрузка", className = "" }: { label?: string; className?: string }) {
    return (
        <div role="status" aria-label={label} className={`flex w-full items-center justify-center ${className}`}>
            <svg aria-hidden viewBox="22 22 44 44" className="h-10 w-10 animate-spin text-primary [animation-duration:1.4s]">
                <circle cx="44" cy="44" r="20.2" fill="none" stroke="currentColor" strokeWidth="3.6" strokeDasharray="80 200" strokeLinecap="round" />
            </svg>
        </div>
    );
}
