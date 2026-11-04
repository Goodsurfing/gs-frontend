import { DuoPanel } from "./DuoPanel";
import { type DuoLabels, fill } from "./duo";

const greenButton = "inline-flex items-center justify-center rounded-[10px] border border-cta bg-cta px-[50px] py-2.5 text-center text-[16px] leading-[120%] text-white no-underline transition-all duration-300 hover:bg-white hover:text-cta";

/**
 * «Едете вдвоём?» под тарифами волонтёра — только если тариф «на двоих»
 * включён в админке (цена — из API, меняется там же). Вошедшему с «на двоих»
 * здесь же — ссылка-приглашение или кто присоединился.
 */
export function DuoOffer({ price, payHref, inviteBase, labels }: {
    price: number | null;
    payHref: string;
    inviteBase: string;
    labels: DuoLabels;
}) {
    return (
        <section className="bg-white">
            <div className="mx-auto flex max-w-[1150px] flex-col gap-6 px-5 py-10">
                {price !== null && (
                    <div className="flex items-center gap-8 rounded-xl bg-[#f5f7f5] p-7 down-md:flex-col down-md:items-stretch down-md:gap-5">
                        <div className="min-w-0 flex-1">
                            <h2 className="mb-2 text-[1.5rem] leading-[1.3] font-bold text-[#1a1a1a] down-md:text-[1.25rem]">{labels["offer-title"]}</h2>
                            <p className="text-[1rem] leading-[1.6] text-[#424242]">{labels["offer-text"]}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-center gap-3 down-md:items-stretch">
                            <p className="text-center">
                                <span className="block text-[1.375rem] font-bold whitespace-nowrap text-[#212121]">{fill(labels["offer-price"], { price: price.toLocaleString("ru-RU") })}</span>
                                <span className="text-[0.875rem] text-[#86909a]">{fill(labels["offer-per-person"], { price: Math.round(price / 2).toLocaleString("ru-RU") })}</span>
                            </p>
                            <a href={payHref} className={greenButton}>{labels["offer-button"]}</a>
                        </div>
                    </div>
                )}
                <DuoPanel inviteBase={inviteBase} labels={labels} />
            </div>
        </section>
    );
}
