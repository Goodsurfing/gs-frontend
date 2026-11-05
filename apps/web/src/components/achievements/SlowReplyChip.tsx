/**
 * «Долго отвечает» (GS-242): больше половины откликов неделю и дольше без ответа организатора
 * (ResponseStatsResult.slow). Не значок-достижение, а предупреждение — рядом со значками организации.
 */
export function SlowReplyChip({ label, hint }: { label: string; hint: string }) {
    return (
        <span title={hint} className="flex items-center gap-1.5 rounded-full bg-attention-bg py-1 pr-3 pl-2 text-[13px] text-attention">
            <span aria-hidden>🐢</span>
            <span>{label}</span>
            <span className="sr-only">: {hint}</span>
        </span>
    );
}
