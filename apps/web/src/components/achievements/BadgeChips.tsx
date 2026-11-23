/** Значки строкой: иконка + название, подсказка — за что. Ведут на «Все достижения». */
export function BadgeChips({ badges, href, className = "" }: {
    badges: { id: number; name: string; description: string; image: string }[];
    href: string;
    className?: string;
}) {
    if (badges.length === 0) return null;
    return (
        <ul className={`flex flex-wrap gap-2 ${className}`}>
            {badges.map((badge) => (
                <li key={badge.id}>
                    <a href={href} title={badge.description} className="flex items-center gap-1.5 rounded-full bg-field py-1 pr-3 pl-1 text-[13px] text-ink-secondary no-underline hover:bg-accent-bg">
                        {/* eslint-disable-next-line @next/next/no-img-element -- значок из справочника, 20 px */}
                        <img src={badge.image} alt="" width={20} height={20} loading="lazy" className="h-5 w-5 shrink-0" />
                        <span>{badge.name}</span>
                    </a>
                </li>
            ))}
        </ul>
    );
}
