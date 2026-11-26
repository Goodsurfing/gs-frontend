/** Миниатюра с зарезервированным местом и подложкой, пока грузится (как Thumb приложения gs-mobile) */
export function Thumb({ src, size, lazy = false }: { src?: string; size: number; lazy?: boolean }) {
    return (
        <span className="shrink-0 overflow-hidden rounded-m-card bg-m-surface" style={{ width: size, height: size }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- превью small/medium с API, размер задан */}
            {src && <img src={src} alt="" width={size} height={size} loading={lazy ? "lazy" : "eager"} decoding="async" className="block h-full w-full object-cover" />}
        </span>
    );
}
