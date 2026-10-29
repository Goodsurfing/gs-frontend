/** «Посмотреть следующие ↓» (shared/ui/ShowNext) */
export function ShowNext({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="flex cursor-pointer items-center gap-2.5 text-[14px] font-medium text-primary disabled:cursor-wait disabled:opacity-60"
        >
            {label}{" "}
            {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
            <img src="/web/icons/offer/arrow-down.svg" alt="" />
        </button>
    );
}
