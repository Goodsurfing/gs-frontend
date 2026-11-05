import type { StatusChip } from "@/lib/messenger";

export type StatusLabels = Record<StatusChip, string>;

const STYLES: Record<StatusChip, string> = {
    incoming: "bg-status-new/25 text-primary-hover",
    sent: "bg-field text-ink-tertiary",
    accepted: "bg-status-accepted/35 text-cta-hover",
    canceled: "bg-status-rejected/45 text-error",
};

/** Плашка статуса заявки: в списке переписок и в шапке чата */
export function StatusBadge({ chip, labels }: { chip: StatusChip; labels: StatusLabels }) {
    return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] leading-[16px] font-semibold whitespace-nowrap ${STYLES[chip]}`}>{labels[chip]}</span>;
}
