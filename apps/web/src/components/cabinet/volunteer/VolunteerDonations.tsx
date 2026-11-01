"use client";

import type { components } from "@goodsurfing/api";
import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { textSlice } from "@/lib/textSlice";

type Fundraise = components["schemas"]["ListResult8"];

export interface VolunteerDonationsLabels {
    title: string;
    empty: string;
    loadError: string;
    support: string;
    successBadge: string;
    collected: string;
    projectCollected: string;
    left: string;
}

/**
 * «Поддержать другие проекты» (DonationsRecomendationsWidget старого
 * фронта): сборы по сроку окончания, у каждого — карточка (ведёт на сбор)
 * и «Поддержать» (на оплату пожертвования).
 */
export function VolunteerDonations({ hrefs, labels }: {
    hrefs: { fundraise: string; pay: string };
    labels: VolunteerDonationsLabels;
}) {
    const session = useSession();
    const [items, setItems] = useState<Fundraise[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token)
            .GET("/api/v1/fundraise", { params: { query: { sort: "endDate:asc" } } })
            .then(({ data, error: apiError }) => {
                if (cancelled) return;
                if (apiError) setError(labels.loadError);
                setItems(data?.data ?? []);
            })
            .catch(() => {
                if (cancelled) return;
                setError(labels.loadError);
                setItems([]);
            });
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, labels.loadError]);

    return (
        <div className="w-full max-w-[1400px]">
            <Toast text={error} onClose={() => setError(null)} />
            <section className="w-full max-w-[1000px] bg-white shadow-[0_5px_20px_rgba(14,29,39,0.05)]">
                <div className="flex justify-between border-b border-caption px-5 py-[13px] down-sm:flex-wrap down-sm:gap-y-2.5">
                    <h3 className="text-[1.17em] font-bold">{labels.title}</h3>
                </div>
                <div className="flex flex-col gap-2 p-3.5">
                    {items === null ? <Spinner /> : items.length === 0 ? <span>{labels.empty}</span> : items.map((item) => (
                        <article key={item.id} className="flex w-full items-start gap-3.5 border border-accent-bg bg-white">
                            <DonationCard item={item} href={hrefs.fundraise.replace("{id}", item.id)} labels={labels} />
                            <a
                                href={hrefs.pay.replace("{id}", item.id)}
                                className="mt-5 mr-5 flex items-center justify-center rounded-[10px] border border-cta bg-cta px-[50px] py-2.5 text-center text-label text-white no-underline transition-all duration-300 hover:bg-white hover:text-cta"
                            >
                                {labels.support}
                            </a>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

/** Карточка сбора (DonationCard старого фронта, без тени — внутри рамки) */
function DonationCard({ item, href, labels }: { item: Fundraise; href: string; labels: VolunteerDonationsLabels }) {
    const image = mediaUrl(item.image, "medium");
    const percent = item.percentAmountCollect ?? 0;
    const icon = (name: string) => (
        // eslint-disable-next-line @next/next/no-img-element -- иконка
        <img src={`/web/icons/donation/${name}.svg`} alt={name} />
    );
    return (
        <a href={href} className="flex w-full items-start gap-3.5 bg-white p-5 text-inherit no-underline down-xs:flex-wrap down-xs:p-4">
            <div className="relative h-[140px] w-[180px] shrink-0 down-xs:h-[180px] down-xs:w-full">
                {image
                    // eslint-disable-next-line @next/next/no-img-element -- обложка из хранилища
                    ? <img src={image} alt="donation-img" loading="lazy" className="h-full w-full object-cover" />
                    : <div className="h-full w-full bg-accent-bg" />}
                {item.isSuccess && <div className="absolute top-2.5 left-2.5 rounded-[40px] bg-cta px-1.5 py-1 text-[10px] leading-none text-white uppercase">{labels.successBadge}</div>}
            </div>
            <div className="w-full">
                <div className={`mb-2 h-[5px] overflow-hidden rounded-[2.5px] ${item.isSuccess ? "bg-[#21212126]" : "bg-[#3CABF740]"}`}>
                    <div className={`h-full rounded-[2.5px] ${item.isSuccess ? "bg-caption" : "bg-primary"}`} style={{ width: `${Math.min(100, percent)}%` }} />
                </div>
                <p className="text-[1.125rem] leading-[22px] font-medium text-ink-secondary">{textSlice(item.name, 50, "Без заголовка")}</p>
                <div className="mt-2 text-[14px] leading-5 font-medium text-caption down-xs:flex down-xs:flex-col">
                    <p>{textSlice(item.organization?.name, 25, "")}</p>
                    <p className="mt-2 max-w-[300px] leading-[17px] text-ink-secondary opacity-50">{textSlice(item.shortDescription, 50, "Без описания")}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 down-xs:gap-2">
                    {item.isSuccess ? (
                        <span className="flex items-center gap-1.5 text-[14px] leading-none">{icon("check")}{labels.projectCollected} {percent} %</span>
                    ) : (
                        <>
                            <span className="flex items-center gap-1.5 text-[14px] leading-none">{icon("flag")}{labels.collected} {percent} %</span>
                            {item.daysLeft !== null && item.daysLeft !== undefined && (
                                <span className="flex items-center gap-1.5 text-[14px] leading-none">{icon("calendar")}{labels.left} {item.daysLeft}</span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </a>
    );
}
