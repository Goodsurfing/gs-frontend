import type { ReactNode } from "react";

/**
 * Кольцевая диаграмма (QuotaDiagram старого фронта): серая дорожка и зелёная
 * доля от 12 часов по часовой стрелке, в центре — подпись. Толщина — четверть
 * размера, у кольца заполненности (FillDiagram, chart.js) — половина радиуса.
 */
export function Ring({ size = 110, share, thickness = Math.round(size * 0.25), gap = false, children }: {
    size?: number;
    /** Доля 0…1 */
    share: number;
    thickness?: number;
    /** Белые промежутки 2 px между долями (обводка сегментов chart.js) */
    gap?: boolean;
    children?: ReactNode;
}) {
    const radius = (size - thickness) / 2;
    const length = 2 * Math.PI * radius;
    const filled = Math.max(0, Math.min(1, share)) * length;
    const center = size / 2;
    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg aria-hidden width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={center} cy={center} r={radius} fill="none" className="stroke-accent-bg" strokeWidth={thickness} />
                {filled > 0 && (
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        className="stroke-host transition-[stroke-dasharray] duration-[400ms]"
                        strokeWidth={thickness}
                        strokeDasharray={`${filled} ${length}`}
                        transform={`rotate(-90 ${center} ${center})`}
                    />
                )}
                {gap && filled > 0 && filled < length && [0, filled].map((offset) => {
                    const angle = (offset / length) * 2 * Math.PI - Math.PI / 2;
                    const inner = radius - thickness / 2;
                    const outer = radius + thickness / 2;
                    return (
                        <line
                            key={offset}
                            x1={center + inner * Math.cos(angle)}
                            y1={center + inner * Math.sin(angle)}
                            x2={center + outer * Math.cos(angle)}
                            y2={center + outer * Math.sin(angle)}
                            stroke="#fff"
                            strokeWidth={2}
                        />
                    );
                })}
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">{children}</div>
        </div>
    );
}
