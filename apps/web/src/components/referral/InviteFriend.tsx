"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { browserApi } from "@/lib/browserApi";

export interface InviteFriendLabels {
    intro: string;
    linkLabel: string;
    copy: string;
    copied: string;
    share: string;
    shareText: string;
    invited: string;
    none: string;
    badge: string;
    badgeDone: string;
    error: string;
    retry: string;
}

type Referral = { code: string; link: string; invited: number };

/**
 * «Пригласи друга»: личная ссылка, кнопки «поделиться» и сколько друзей по ней пришло.
 * Награда — значок «Рекомендатор» (выдаётся сам за первого друга), не членство.
 */
export function InviteFriend({ achievementsHref, labels }: { achievementsHref: string; labels: InviteFriendLabels }) {
    const session = useSession();
    const [data, setData] = useState<Referral | null>(null);
    const [failed, setFailed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        browserApi(session.token)
            .GET("/api/v1/referral")
            .then(({ data: result }) => {
                if (cancelled) return;
                if (result) setData(result as Referral);
                else setFailed(true);
            })
            .catch(() => !cancelled && setFailed(true));
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, attempt]);

    if (failed && !data) {
        return (
            <p role="alert" className="mt-6 text-[15px] text-error">
                {labels.error}{" "}
                <button type="button" onClick={() => { setFailed(false); setAttempt((n) => n + 1); }} className="cursor-pointer text-primary underline">{labels.retry}</button>
            </p>
        );
    }
    if (!data) return <Loading className="min-h-[200px]" />;

    const text = labels.shareText;
    const url = encodeURIComponent(data.link);
    const shares = [
        { name: "Telegram", href: `https://t.me/share/url?url=${url}&text=${encodeURIComponent(text)}`, icon: "/web/icons/social-mini/telegram-mini-logo.svg" },
        { name: "VK", href: `https://vk.com/share.php?url=${url}&title=${encodeURIComponent(text)}`, icon: "/web/icons/social-mini/vk-mini-logo.svg" },
        { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${text} ${data.link}`)}`, icon: null },
    ];

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(data.link);
        } catch {
            // Старый браузер без доступа к буферу: выделить текст в поле, пусть скопирует сам
            (document.getElementById("invite-link") as HTMLInputElement | null)?.select();
            return;
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };
    const nativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

    return (
        <div className="mt-4 flex max-w-[624px] flex-col gap-6">
            <p className="text-[16px] leading-[140%]">{labels.intro}</p>
            <div className="flex flex-col gap-2">
                <label htmlFor="invite-link" className="text-[14px] text-caption">{labels.linkLabel}</label>
                <div className="flex gap-2.5 down-sm:flex-col">
                    <input id="invite-link" readOnly value={data.link} onFocus={(event) => event.target.select()} className="w-full rounded-[10px] border border-field bg-white px-4 py-3 text-[15px] outline-none" />
                    <button type="button" onClick={() => void copy()} className="shrink-0 cursor-pointer rounded-[10px] border border-primary bg-primary px-6 py-3 text-[15px] text-white transition-colors hover:bg-white hover:text-primary">
                        {copied ? labels.copied : labels.copy}
                    </button>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-[14px] text-caption">{labels.share}</span>
                {nativeShare && (
                    <button type="button" onClick={() => void navigator.share({ title: "GoodSurfing", text, url: data.link }).catch(() => undefined)} className="cursor-pointer rounded-full border border-accent-bg px-4 py-2 text-[14px] hover:border-primary">
                        {labels.share}…
                    </button>
                )}
                {shares.map((item) => (
                    <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full border border-accent-bg px-4 py-2 text-[14px] text-ink no-underline hover:border-primary">
                        {/* eslint-disable-next-line @next/next/no-img-element -- иконка соцсети 16×16 */}
                        {item.icon && <img src={item.icon} alt="" width={16} height={16} />}
                        {item.name}
                    </a>
                ))}
            </div>
            <div className="rounded-[10px] bg-accent-bg px-5 py-4">
                <p className="text-[16px]">{data.invited > 0 ? labels.invited.replace("{{count}}", String(data.invited)) : labels.none}</p>
                <p className="mt-1 text-[14px] text-caption">
                    {data.invited > 0 ? labels.badgeDone : labels.badge}{" "}
                    <a href={achievementsHref} className="text-primary">→</a>
                </p>
            </div>
        </div>
    );
}
