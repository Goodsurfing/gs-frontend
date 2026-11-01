/**
 * Кольцевая диаграмма заполненности (doughnut chart.js в StatsChart старого фронта):
 * закрашенная доля — зелёная, остальное — серое, вырез 50 %, белый шов 2 px
 * между долями (borderWidth chart.js), начало сверху по часовой стрелке.
 */
export function Doughnut({ share, size = 110, children }: { share: number; size?: number; children?: React.ReactNode }) {
    const r = size / 2;
    const inner = r / 2;
    const value = Math.max(0, Math.min(1, share));
    const point = (angle: number, radius: number) => [r + radius * Math.sin(angle), r - radius * Math.cos(angle)] as const;
    const arc = (from: number, to: number) => {
        const large = to - from > Math.PI ? 1 : 0;
        const [x1, y1] = point(from, r - 1);
        const [x2, y2] = point(to, r - 1);
        const [x3, y3] = point(to, inner);
        const [x4, y4] = point(from, inner);
        return `M${x1} ${y1}A${r - 1} ${r - 1} 0 ${large} 1 ${x2} ${y2}L${x3} ${y3}A${inner} ${inner} 0 ${large} 0 ${x4} ${y4}Z`;
    };
    const ring = (fill: string) => (
        <>
            <circle cx={r} cy={r} r={(r - 1 + inner) / 2} fill="none" style={{ stroke: fill }} strokeWidth={r - 1 - inner} />
            <circle cx={r} cy={r} r={r - 1} fill="none" stroke="#fff" strokeWidth={2} />
            <circle cx={r} cy={r} r={inner} fill="none" stroke="#fff" strokeWidth={2} />
        </>
    );
    const full = 2 * Math.PI * value;

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg aria-hidden width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
                {value <= 0 && ring("var(--color-accent-bg)")}
                {value >= 1 && ring("var(--color-host)")}
                {value > 0 && value < 1 && (
                    <g stroke="#fff" strokeWidth={2} strokeLinejoin="round">
                        <path d={arc(0, full)} style={{ fill: "var(--color-host)" }} />
                        <path d={arc(full, 2 * Math.PI)} style={{ fill: "var(--color-accent-bg)" }} />
                    </g>
                )}
            </svg>
            {children && <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px] font-bold whitespace-nowrap">{children}</span>}
        </div>
    );
}
