"use client";

/**
 * Переключатель с подписью (Switch и FormControlLabel MUI в шагах мастера
 * старого фронта): бегунок всегда белый с тенью, дорожка — чёрная 38 % или
 * синяя; подпись шрифтом MUI (Roboto → Helvetica → Arial), 16 px, 500.
 * Внутри — настоящий чекбокс с ролью switch: подпись — его имя.
 */
export function LabeledSwitch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <label className="mr-4 -ml-[11px] inline-flex cursor-pointer items-center align-middle">
            <span className="relative z-0 inline-flex h-[38px] w-[58px] shrink-0 overflow-hidden p-3 align-middle">
                <span className={`group absolute top-0 left-0 z-[1] inline-flex h-[38px] w-[38px] items-center justify-center rounded-full p-[9px] transition-transform duration-150 hover:bg-[rgba(0,0,0,0.04)] ${checked ? "translate-x-5" : ""}`}>
                    <input
                        type="checkbox"
                        role="switch"
                        checked={checked}
                        onChange={onChange}
                        className="absolute top-0 -left-full z-[1] m-0 h-full w-[300%] cursor-pointer p-0 opacity-0"
                    />
                    <span className="block h-5 w-5 rounded-full bg-white shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]" />
                </span>
                <span className={`block h-full w-full rounded-[7px] transition-[opacity,background-color] duration-150 ${checked ? "bg-primary" : "bg-black opacity-[0.38]"}`} />
            </span>
            <span className="font-[Roboto,Helvetica,Arial,sans-serif] text-[16px] leading-[24px] font-medium tracking-[0.00938em] text-black">{label}</span>
        </label>
    );
}
