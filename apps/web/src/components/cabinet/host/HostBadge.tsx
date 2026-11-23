"use client";

import { useState } from "react";

import { useMyOrganization } from "@/components/cabinet/host/useMyOrganization";
import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { badgeHtml, shareLinks, withShareMark } from "@/lib/share";

export interface HostBadgeLabels {
    title: string;
    intro: string;
    preview: string;
    codeTitle: string;
    codeHint: string;
    copyCode: string;
    copied: string;
    download: string;
    linkTitle: string;
    linkHint: string;
    copyLink: string;
    shareText: string;
    noOrganization: string;
}

const button = "inline-flex cursor-pointer items-center justify-center rounded-[10px] border px-5 py-2.5 text-[15px] leading-[120%] no-underline transition-all duration-300";

/**
 * «Значок для сайта» в кабинете организатора: значок «Мы на Гудсёрфинге» с
 * рейтингом и отзывами (обновляется сам) — код для сайта, картинка для соцсетей
 * и ссылка на страницу организации с меткой (видно в Метрике, сколько пришло).
 */
export function HostBadge({ organizationTemplate, labels }: {
    /** Адрес страницы организации с {id} */
    organizationTemplate: string;
    labels: HostBadgeLabels;
}) {
    const session = useSession();
    const { organization, failed } = useMyOrganization();
    const [copied, setCopied] = useState<"code" | "link" | null>(null);

    if (failed || session.status === "guest") return <p className="text-ink-secondary">{labels.noOrganization}</p>;
    if (!organization?.id) return <Loading />;
    const hostId = organization.id;
    const name = organization.name ?? "";

    const origin = window.location.origin;
    const page = organizationTemplate.replace("{id}", hostId);
    const badgeSrc = `${origin}${page}/badge`;
    const code = badgeHtml({ pageUrl: withShareMark(`${origin}${page}`, "badge", "organization"), imageUrl: badgeSrc, name });
    const link = withShareMark(`${origin}${page}`, "host", "organization");
    const links = shareLinks(link, labels.shareText);
    const copy = (what: "code" | "link", value: string) => {
        void navigator.clipboard?.writeText(value).then(() => setCopied(what)).catch(() => setCopied(null));
    };

    return (
        <div className="flex max-w-[760px] flex-col gap-8">
            <div>
                <h2 className="mb-3 text-[1.625rem] leading-8 font-normal">{labels.title}</h2>
                <p className="text-[15px] leading-[1.55] text-ink-secondary">{labels.intro}</p>
            </div>

            <section className="flex flex-col gap-4">
                <h3 className="text-[1.125rem] font-semibold">{labels.preview}</h3>
                {/* Место под значок зарезервировано (300×100) */}
                <div className="flex h-[100px] w-[300px] items-center justify-center rounded-[14px] bg-field">
                    {/* eslint-disable-next-line @next/next/no-img-element -- картинка рисуется сервером */}
                    <img loading="eager" src={badgeSrc} width={300} height={100} alt={labels.preview} />
                </div>
                <label className="flex flex-col gap-1.5 text-[14px] text-ink-secondary">
                    {labels.codeTitle}
                    <textarea readOnly rows={3} value={code} onFocus={(event) => event.currentTarget.select()} className="resize-none rounded-[10px] border border-[#e0e0e0] bg-field px-3 py-2.5 font-mono text-[13px] text-ink" />
                </label>
                <p className="text-[13px] text-caption">{labels.codeHint}</p>
                <div className="flex flex-wrap gap-2.5">
                    <button type="button" onClick={() => copy("code", code)} className={`${button} border-cta bg-cta text-white hover:bg-white hover:text-cta`}>{copied === "code" ? labels.copied : labels.copyCode}</button>
                    <a href={`${page}/badge`} download="goodsurfing-badge.png" className={`${button} border-primary text-primary hover:bg-primary hover:text-white`}>{labels.download}</a>
                </div>
            </section>

            <section className="flex flex-col gap-4 border-t border-[#eee] pt-6">
                <h3 className="text-[1.125rem] font-semibold">{labels.linkTitle}</h3>
                <p className="text-[14px] leading-[1.5] text-ink-secondary">{labels.linkHint}</p>
                <input readOnly value={link} onFocus={(event) => event.currentTarget.select()} aria-label={labels.linkTitle} className="rounded-[10px] border border-[#e0e0e0] bg-field px-3 py-2.5 text-[14px] text-ink" />
                <div className="flex flex-wrap gap-2.5">
                    <button type="button" onClick={() => copy("link", link)} className={`${button} border-primary bg-primary text-white hover:bg-white hover:text-primary`}>{copied === "link" ? labels.copied : labels.copyLink}</button>
                    <a href={links.vk} target="_blank" rel="noopener noreferrer" className={`${button} border-[#0077FF] text-[#0077FF] hover:bg-[#0077FF] hover:text-white`}>ВКонтакте</a>
                    <a href={links.telegram} target="_blank" rel="noopener noreferrer" className={`${button} border-[#229ED9] text-[#229ED9] hover:bg-[#229ED9] hover:text-white`}>Telegram</a>
                </div>
            </section>
        </div>
    );
}
