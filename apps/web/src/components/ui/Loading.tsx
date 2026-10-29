/** Индикатор загрузки (Preloader старого фронта): покачивающийся логотип и бегущая волна */
export function Loading({ label = "Загрузка", className = "min-h-[60vh]" }: { label?: string; className?: string }) {
    return (
        <div role="status" aria-label={label} className={`flex items-center justify-center ${className}`}>
            <div className="flex flex-col items-center gap-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- логотип */}
                <img src="/web/icons/header/logo.svg" alt="GoodSurfing" className="h-auto w-[140px] animate-[gs-bob_1.6s_ease-in-out_infinite]" />
                <div className="h-3 w-[120px] overflow-hidden">
                    <svg viewBox="0 0 240 24" fill="none" preserveAspectRatio="none" className="block h-3 w-[240px] animate-[gs-wave_1.6s_linear_infinite]">
                        <path d="M0 12 C 15 2, 45 2, 60 12 C 75 22, 105 22, 120 12 C 135 2, 165 2, 180 12 C 195 22, 225 22, 240 12" stroke="#00A0A8" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
