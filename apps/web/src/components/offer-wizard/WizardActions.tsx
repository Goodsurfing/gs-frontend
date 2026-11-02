/**
 * Низ шага мастера (OfferWhereForm, OfferWhenForm старого фронта): красная
 * строка «несохранённые изменения», синяя «Сохранить» и контурная «Дальше»
 * (Button и ButtonLink MEDIUM). Уже 992 px кнопки тянутся на всю строку и
 * делят её (поля 15 px), уже 576 px встают столбиком.
 */
export function WizardActions({ unsaved, busy, nextHref, labels, className = "pt-[30px]", widePadding = false }: {
    unsaved: boolean;
    busy: boolean;
    nextHref: string;
    labels: { save: string; next: string; unsaved: string };
    className?: string;
    /** «Сохранить» с полями 100 px и на узких экранах (шаг «Когда»: .btn старой формы перебивал MEDIUM) */
    widePadding?: boolean;
}) {
    return (
        <div className={`flex flex-col ${className}`}>
            {/* ErrorText старого фронта: 12 px, красный MUI #d32f2f, поля 15 px */}
            {unsaved && <p className="my-[15px] text-[0.75rem] text-[#d32f2f]">{labels.unsaved}</p>}
            <div className="flex gap-2.5 down-sm:flex-col">
                <button
                    type="submit"
                    disabled={busy}
                    className={`flex cursor-pointer items-center justify-center rounded-[10px] border border-primary bg-primary px-[100px] py-3 text-center text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary down-lg:w-full disabled:cursor-default disabled:opacity-70 disabled:hover:bg-primary disabled:hover:text-white ${widePadding ? "" : "down-lg:px-[15px]"}`}
                >
                    {labels.save}
                </button>
                <a
                    href={nextHref}
                    className="inline-block cursor-pointer rounded-[10px] border border-primary px-[100px] py-3 text-center text-[16px] leading-[120%] text-primary no-underline transition-all duration-300 hover:bg-primary hover:text-white down-lg:w-full down-lg:px-[15px]"
                >
                    {labels.next}
                </a>
            </div>
        </div>
    );
}
