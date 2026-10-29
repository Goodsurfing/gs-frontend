"use client";

import { useSession } from "@/components/session/SessionProvider";

const smallButton = "flex w-full items-center justify-center rounded-[10px] border px-[50px] py-2.5 text-center text-[16px] leading-[120%] text-white transition-all duration-300";

function Features({ items }: { items: string[] }) {
    return (
        <ul className="flex flex-1 list-none flex-col gap-3">
            {items.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[0.9375rem] leading-[1.5] text-[#424242]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                    <img src="/web/images/membership/check.svg" alt="" aria-hidden width={20} height={20} className="mt-0.5 shrink-0" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
    );
}

function CardHeader({ title, price, unit }: { title: string; price: string; unit: string }) {
    return (
        <div className="flex items-baseline justify-between gap-3 border-b border-[#e0e0e0] pb-4">
            <h3 className="text-[1.25rem] font-semibold text-[#212121]">{title}</h3>
            <span className="rounded-[10px] bg-field px-6 py-2 text-[1.375rem] font-bold whitespace-nowrap text-[#212121]">
                {price} <span className="text-[0.875rem] font-normal">{unit}</span>
            </span>
        </div>
    );
}

/**
 * «Без членства» и «Членство» (ForVolunteer / ForHost старого фронта).
 * Гостю — «Зарегистрироваться» в бесплатной карточке; организатору у
 * волонтёрского тарифа — пояснение, что для хостовых возможностей нужен
 * другой (gs-backend #421). Страница общая, поэтому это — в браузере.
 */
export function TariffCards({ id, title, free, paid, price, payHref, signUpHref, hostNote, background, labels }: {
    id: string;
    title: string;
    free: string[];
    paid: string[];
    price: number;
    payHref: string;
    signUpHref: string;
    /** Пояснение организатору — только у волонтёрского тарифа */
    hostNote?: { text: string; link: string };
    /** Фон-фотография под затемнением (у волонтёрского); иначе — светлый фон и карточки с тенью */
    background?: boolean;
    labels: { free: string; paid: string; unit: string; signUp: string; get: string };
}) {
    const session = useSession();
    const isHost = !!(session.profile as { hostId?: string | null } | null)?.hostId;

    return (
        <section
            id={id}
            className={`mt-20 ${background ? "relative bg-[url(/web/images/membership/back.webp)] bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-black/62" : "bg-[#f5f7f5]"}`}
        >
            <div className="relative mx-auto max-w-[1150px] px-5 py-[60px]">
                <h2 className={`mb-10 text-center text-[1.75rem] leading-[1.3] font-bold down-md:text-[1.375rem] ${background ? "text-white" : "text-[#1a1a1a]"}`}>{title}</h2>
                <div className="flex items-start gap-6 down-md:flex-col">
                    <div className={`flex flex-1 flex-col gap-5 rounded-xl bg-white p-7 ${background ? "" : "shadow-[0_2px_12px_rgba(0,0,0,0.08)]"}`}>
                        <CardHeader title={labels.free} price="0" unit={labels.unit} />
                        <Features items={free} />
                        {session.status !== "user" && (
                            <a href={signUpHref} className={`${smallButton} mt-2 border-primary bg-primary hover:bg-white hover:text-primary`}>{labels.signUp}</a>
                        )}
                    </div>
                    <div className={`flex flex-1 flex-col gap-5 rounded-xl border-2 border-[#4CAF50] bg-white p-7 ${background ? "" : "shadow-[0_2px_12px_rgba(0,0,0,0.08)]"}`}>
                        <CardHeader title={labels.paid} price={price.toLocaleString("ru-RU")} unit={labels.unit} />
                        <Features items={paid} />
                        {hostNote && isHost && (
                            <p className="mt-3 text-[14px] leading-[1.4] text-[#86909a]">
                                {hostNote.text}{" "}
                                <a href="#host" className="underline">{hostNote.link}</a>.
                            </p>
                        )}
                        <a href={payHref} className={`${smallButton} mt-2 border-cta bg-cta hover:bg-white hover:text-cta`}>{labels.get}</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
