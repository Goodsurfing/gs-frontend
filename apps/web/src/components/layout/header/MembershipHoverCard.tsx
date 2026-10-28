"use client";

import * as HoverCard from "@radix-ui/react-hover-card";

export interface MembershipOffer {
    label: string;
    text: string;
    cta: string;
    href: string;
    tone: "volunteer" | "host";
}

/**
 * Кнопка «Членство» в десктопной шапке: клик ведёт на /membership, при
 * наведении — окно с тарифами (GS-149). Небольшая задержка закрытия даёт
 * довести курсор до окна через зазор (в старом фронте окно при этом пропадало).
 */
export function MembershipHoverCard({ label, href, offers }: { label: string; href: string; offers: MembershipOffer[] }) {
    return (
        <HoverCard.Root openDelay={0} closeDelay={150}>
            <HoverCard.Trigger asChild>
                <a
                    href={href}
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-[10px] border border-cta bg-cta px-3.5 text-[13.5px] font-semibold whitespace-nowrap text-white no-underline transition-colors duration-150 hover:border-cta-deep hover:bg-cta-deep"
                >
                    {label}
                </a>
            </HoverCard.Trigger>
            <HoverCard.Portal>
                <HoverCard.Content
                    align="end"
                    sideOffset={12}
                    className="z-50 w-min animate-fade-in rounded-[14px] bg-field px-4 py-3.5 shadow-[0_12px_32px_rgba(14,29,39,0.16)]"
                >
                    <div className="flex max-w-[480px] flex-wrap gap-4">
                        {offers.map((offer) => (
                            <div
                                key={offer.tone}
                                className={`flex flex-[1_1_200px] flex-col gap-2 rounded-[12px] border-l-[3px] bg-card p-4 ${offer.tone === "host" ? "border-host" : "border-primary"}`}
                            >
                                <span className="text-[12px] font-bold tracking-[0.02em] text-ink-secondary uppercase">{offer.label}</span>
                                <p className="text-[13px] leading-[1.4] text-ink-secondary">{offer.text}</p>
                                <a
                                    href={offer.href}
                                    className={`flex items-center justify-center rounded-[10px] border px-[50px] py-2.5 text-center text-[16px] leading-[120%] text-white no-underline transition-colors hover:bg-white ${offer.tone === "host" ? "border-cta bg-cta hover:text-cta" : "border-primary bg-primary hover:text-primary"}`}
                                >
                                    {offer.cta}
                                </a>
                            </div>
                        ))}
                    </div>
                </HoverCard.Content>
            </HoverCard.Portal>
        </HoverCard.Root>
    );
}
