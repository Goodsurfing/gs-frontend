"use client";

import type { components } from "@goodsurfing/api";
import { useCallback, useEffect, useState } from "react";

import { MemberBanner } from "@/components/content/MemberBanner";
import { useSession } from "@/components/session/SessionProvider";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { hasHostMembership } from "@/lib/occupancy";

type Fundraise = components["schemas"]["ListResult8"];

export interface HostFundraisesLabels {
    title: string;
    drafts: string;
    empty: string;
    add: string;
    memberTitle: string;
    memberButton: string;
    edit: string;
    close: string;
    remove: string;
    collected: string;
    daysLeft: string;
    confirm: string;
    ok: string;
    cancel: string;
    error: string;
}

/**
 * «Мои сборы» (HostFundraisePage старого фронта): активные и черновики.
 * «Добавить сбор» — только с членством, иначе баннер «Оформи членство».
 * Карточка ведёт на публичную страницу сбора, «Редактировать» — на
 * приветствие мастера (мастер в старом SPA).
 */
export function HostFundraises({ locale, routes, labels }: {
    locale: Locale;
    /** Адреса с {id}: публичный сбор и приветствие мастера */
    routes: { fundraise: string; welcome: string };
    labels: HostFundraisesLabels;
}) {
    const session = useSession();
    const [active, setActive] = useState<Fundraise[] | null>(null);
    const [drafts, setDrafts] = useState<Fundraise[] | null>(null);
    const [member, setMember] = useState<boolean | null>(null);
    const [confirm, setConfirm] = useState<{ id: string; action: "close" | "delete" } | null>(null);
    const [creating, setCreating] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const closeError = useCallback(() => setError(null), []);

    const load = useCallback(async () => {
        const api = browserApi(session.token);
        const list = async (status: "active" | "draft") => (await api.GET("/api/v1/fundraise", { params: { query: { isAuth: true, status } as never } })
            .catch(() => ({ data: undefined }))).data?.data ?? [];
        const [nextActive, nextDrafts] = await Promise.all([list("active"), list("draft")]);
        setActive(nextActive);
        setDrafts(nextDrafts);
    }, [session.token]);

    useEffect(() => {
        if (session.status !== "user") return;
        // Списки и членство — после того, как сессия узнала вошедшего
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void load();
        void browserApi(session.token).GET("/api/v1/profile/occupancy")
            .then(({ data }) => setMember(data ? hasHostMembership(data) : false))
            .catch(() => setMember(false));
    }, [session.status, session.token, load]);

    if (!active || !drafts) return <Loading className="min-h-[300px] w-full max-w-[1200px]" />;

    const act = async () => {
        if (!confirm || busy) return;
        const api = browserApi(session.token);
        setBusy(true);
        const { error: failed } = confirm.action === "close"
            ? await api.PATCH("/api/v1/fundraise/{id}/toggle-status", { params: { path: { id: confirm.id } }, body: { status: "close" } as never }).catch(() => ({ error: true }))
            : await api.DELETE("/api/v1/fundraise/{id}", { params: { path: { id: confirm.id } } }).catch(() => ({ error: true }));
        // В старом ошибка закрытия и удаления проходила молча
        if (failed) setError(labels.error);
        setBusy(false);
        setConfirm(null);
        await load();
    };

    const create = async () => {
        setCreating(true);
        const { data } = await browserApi(session.token).POST("/api/v1/fundraise").catch(() => ({ data: undefined }));
        if (data?.id) {
            window.location.assign(routes.welcome.replace("{id}", data.id));
        } else {
            setCreating(false);
            setError(labels.error);
        }
    };

    const cards = (items: Fundraise[]) => items.map((item) => (
        <FundraiseCard
            key={item.id}
            item={item}
            href={routes.fundraise.replace("{id}", item.id)}
            onEdit={() => window.location.assign(routes.welcome.replace("{id}", item.id))}
            onClose={() => setConfirm({ id: item.id, action: "close" })}
            onDelete={() => setConfirm({ id: item.id, action: "delete" })}
            labels={labels}
        />
    ));

    return (
        <div className="flex w-full max-w-[1200px] flex-col gap-5">
            <Toast text={error} onClose={closeError} />
            <h2 className="text-[1.5em] font-bold">{labels.title}</h2>
            <div className="flex flex-col gap-4">
                {active.length ? cards(active) : <span className="text-[0.875rem] text-caption">{labels.empty}</span>}
            </div>
            {drafts.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-[1.5rem] font-bold">{labels.drafts}</h2>
                    <div className="flex flex-col gap-4">{cards(drafts)}</div>
                </div>
            )}
            {/* До ответа о членстве — ничего (в старом сначала мигал баннер) */}
            {member === true && (
                <button
                    type="button"
                    disabled={creating}
                    onClick={() => void create()}
                    className="flex min-w-[200px] cursor-pointer items-center justify-center self-start rounded-[10px] border border-primary bg-primary px-[100px] py-3 text-label text-white transition-all duration-300 hover:bg-white hover:text-primary disabled:opacity-70 down-lg:w-full down-lg:px-[15px]"
                >
                    {labels.add}
                </button>
            )}
            {member === false && <MemberBanner locale={locale} title={labels.memberTitle} button={labels.memberButton} anchor="host" />}
            <ConfirmDialog
                open={!!confirm}
                size="medium"
                text={labels.confirm}
                confirm={labels.ok}
                cancel={labels.cancel}
                busy={busy}
                onConfirm={() => void act()}
                onClose={() => setConfirm(null)}
            />
        </div>
    );
}

const small = "cursor-pointer rounded-[10px] border px-[50px] py-2.5 text-label transition-all duration-300";

/** Карточка сбора в кабинете (HostFundraiseCard старого фронта) */
function FundraiseCard({ item, href, onEdit, onClose, onDelete, labels }: {
    item: Fundraise;
    href: string;
    onEdit: () => void;
    onClose: () => void;
    onDelete: () => void;
    labels: HostFundraisesLabels;
}) {
    const image = mediaUrl(item.image, "medium");
    return (
        <div className="box-border flex w-full max-w-[900px] items-start gap-3.5 bg-white p-5 shadow-[0_5px_20px_0_#2121210d] transition-shadow duration-300 hover:shadow-[0_5px_20px_0_rgb(33_33_33/15%)] down-1200:flex-wrap">
            <a href={href} className="flex min-w-0 flex-1 gap-3.5 text-inherit no-underline down-sm:flex-wrap">
                <div className="h-[140px] w-[180px] shrink-0 down-sm:h-[180px] down-sm:w-full">
                    {image
                        // eslint-disable-next-line @next/next/no-img-element -- обложка сбора
                        ? <img src={image} alt={item.name} className="h-full w-full object-cover" />
                        : <div className="h-full w-full bg-[#e0e0e0]" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    {/* Цвет полосы — по закрытию сбора, как в старом кабинете */}
                    <div className={`h-[5px] w-full overflow-hidden rounded-[2.5px] ${item.isClose ? "bg-[#21212126]" : "bg-[#3CABF740]"}`}>
                        <div className={`h-full rounded-[2.5px] ${item.isClose ? "bg-caption" : "bg-primary"}`} style={{ width: `${Math.min(100, Number(item.percentAmountCollect) || 0)}%` }} />
                    </div>
                    <h3 className="text-[1.125rem] leading-[22px] font-bold text-ink-secondary">{item.name}</h3>
                    <p className="text-[0.875rem] font-medium text-caption">{item.organization?.name}</p>
                    {item.shortDescription && <p className="line-clamp-2 text-[0.875rem] leading-[1.4] text-ink-secondary opacity-50">{item.shortDescription}</p>}
                    <div className="mt-1 flex flex-wrap gap-6">
                        <span className="flex items-center gap-1.5 text-[0.875rem] font-medium text-ink-secondary">
                            {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                            <img src="/web/icons/donation/flag.svg" alt="" className="h-4 w-4" />
                            {labels.collected} {item.percentAmountCollect}%
                        </span>
                        <span className="flex items-center gap-1.5 text-[0.875rem] font-medium text-ink-secondary">
                            {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                            <img src="/web/icons/donation/calendar.svg" alt="" className="h-4 w-4" />
                            {labels.daysLeft} {item.daysLeft ?? ""}
                        </span>
                    </div>
                </div>
            </a>
            <div className="flex shrink-0 flex-col gap-2.5 down-1200:grid down-1200:w-full down-1200:grid-cols-3 down-sm:grid-cols-1">
                <button type="button" onClick={onEdit} className={`${small} border-cta bg-cta text-white hover:bg-white hover:text-cta`}>{labels.edit}</button>
                <button type="button" onClick={onClose} className={`${small} border-caption text-caption hover:bg-caption hover:text-white`}>{labels.close}</button>
                <button type="button" onClick={onDelete} className={`${small} border-error bg-error text-white hover:bg-white hover:text-error`}>{labels.remove}</button>
            </div>
        </div>
    );
}
