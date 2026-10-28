import cn from "classnames";
import { FC, ReactNode, memo } from "react";

import styles from "./QuotaDiagram.module.scss";

interface QuotaDiagramProps {
    className?: string;
    /** Сколько осталось; null — без ограничений (∞). */
    remaining: number | null;
    limit: number;
    label: string;
    /** Ссылка-призыв под диаграммой. */
    hint?: ReactNode;
    /** column — диаграмма над текстом (дашборды), row — сбоку (полоса фильтров). */
    layout?: "column" | "row";
    size?: number;
}

/**
 * GS-188: остаток бесплатных откликов или вакансий круговой диаграммой —
 * в том же стиле, что «Заполненность профиля» на дашбордах (те же цвета и
 * толщина кольца). Закрашенная часть — сколько осталось.
 */
export const QuotaDiagram: FC<QuotaDiagramProps> = memo((props: QuotaDiagramProps) => {
    const {
        className, remaining, limit, label, hint, layout = "column", size = 110,
    } = props;

    const isUnlimited = remaining === null;
    const safeRemaining = Math.max(0, Math.min(remaining ?? limit, limit));
    const share = isUnlimited || limit <= 0 ? 1 : safeRemaining / limit;

    // Толщина кольца — как у doughnut chart.js в StatsChart (вырез 50%).
    const stroke = Math.round(size * 0.25);
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const value = isUnlimited ? "∞" : `${safeRemaining}/${limit}`;

    return (
        <div className={cn(styles.wrapper, styles[layout], className)}>
            <div className={styles.chart} style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
                    <circle
                        className={styles.track}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={stroke}
                        fill="none"
                    />
                    {share > 0 && (
                        <circle
                            className={styles.fill}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            strokeWidth={stroke}
                            fill="none"
                            strokeDasharray={`${circumference * share} ${circumference}`}
                            transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        />
                    )}
                </svg>
                <span
                    className={cn(styles.value, { [styles.infinity]: isUnlimited })}
                    data-testid="quota-value"
                >
                    {value}
                </span>
            </div>
            <div className={styles.text}>
                <span className={styles.label}>{label}</span>
                {hint}
            </div>
        </div>
    );
});
