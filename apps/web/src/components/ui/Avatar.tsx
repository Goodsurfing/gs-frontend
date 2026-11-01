/**
 * Аватар как в старом фронте (shared/ui/Avatar): фото, иначе первая буква
 * имени на голубом круге, иначе серый круг.
 */
export function Avatar({ src, name, size = 30, className = "" }: { src?: string; name?: string | null; size?: number; className?: string }) {
    const box = { width: size, height: size };
    if (src) {
        // eslint-disable-next-line @next/next/no-img-element -- аватар с API, размер мал
        return <img src={src} alt="" style={box} className={`shrink-0 rounded-full object-cover ${className}`} />;
    }
    const letter = name?.trim().charAt(0).toUpperCase();
    return (
        <span
            aria-hidden
            style={{ ...box, fontSize: size * 0.4 }}
            className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${letter ? "bg-primary text-white" : "bg-accent-bg"} ${className}`}
        >
            {letter}
        </span>
    );
}
