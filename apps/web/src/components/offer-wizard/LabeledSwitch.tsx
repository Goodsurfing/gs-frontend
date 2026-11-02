"use client";

/** Подписи переключателей старого фронта: Roboto 500 (шаг «Когда»), Lato 400 16 px (#212121) и 14 px */
const LABEL = {
    roboto: "font-[Roboto,Helvetica,Arial,sans-serif] text-[16px] leading-[24px] font-medium tracking-[0.00938em] text-black",
    lato: "font-[Lato] text-[16px] leading-[24px] font-normal tracking-[0.00938em] text-ink-secondary",
    small: "font-[Lato] text-[14px] leading-[1.5] font-normal tracking-[0.00938em] text-black",
    /** Typography body1 без начертания (переключатель «только верифицированные» на «Последних штрихах») */
    body: "font-[Roboto,Helvetica,Arial,sans-serif] text-[16px] leading-[1.5] tracking-[0.00938em] text-black",
} as const;

/** Сам бегунок Switch MUI (без подписи) — общий для переключателей мастера */
export function SwitchKnob({ checked, onChange, tone = "custom", label }: { checked: boolean; onChange: () => void; tone?: "custom" | "mui"; label?: string }) {
    const thumb = checked && tone === "mui" ? "bg-[#1976d2]" : "bg-white";
    const track = checked ? (tone === "mui" ? "bg-[#1976d2] opacity-50" : "bg-primary") : "bg-black opacity-[0.38]";
    return (
        <span className="relative z-0 inline-flex h-[38px] w-[58px] shrink-0 overflow-hidden p-3 align-middle">
            <span className={`group absolute top-0 left-0 z-[1] inline-flex h-[38px] w-[38px] items-center justify-center rounded-full p-[9px] transition-transform duration-150 hover:bg-[rgba(0,0,0,0.04)] ${checked ? "translate-x-5" : ""}`}>
                <input
                    type="checkbox"
                    role="switch"
                    aria-label={label}
                    checked={checked}
                    onChange={onChange}
                    className="absolute top-0 -left-full z-[1] m-0 h-full w-[300%] cursor-pointer p-0 opacity-0"
                />
                <span className={`block h-5 w-5 rounded-full shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)] ${thumb}`} />
            </span>
            <span className={`block h-full w-full rounded-[7px] transition-[opacity,background-color] duration-150 ${track}`} />
        </span>
    );
}

/**
 * Переключатель с подписью (Switch и FormControlLabel MUI в шагах мастера
 * старого фронта). Обычно бегунок белый с тенью, дорожка — чёрная 38 % или
 * синяя; tone="mui" — нетронутый Switch MUI (бегунок и дорожка #1976d2,
 * дорожка 50 %), так выглядели переключатели языков на шаге «Кто нужен».
 * Внутри — настоящий чекбокс с ролью switch: подпись — его имя.
 */
export function LabeledSwitch({ checked, onChange, label, labelStyle = "roboto", tone = "custom", block = false }: {
    checked: boolean;
    onChange: () => void;
    label: string;
    labelStyle?: keyof typeof LABEL;
    tone?: "custom" | "mui";
    /** Растянуть на всю строку (FormControlLabel в столбце) */
    block?: boolean;
}) {
    return (
        <label className={`mr-4 -ml-[11px] cursor-pointer items-center align-middle ${block ? "flex" : "inline-flex"}`}>
            <SwitchKnob checked={checked} onChange={onChange} tone={tone} />
            <span className={LABEL[labelStyle]}>{label}</span>
        </label>
    );
}
