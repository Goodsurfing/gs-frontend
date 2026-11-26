"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyHint } from "@/components/ui/EmptyHint";
import { Thumb } from "@/components/ui/Thumb";
import { browserApi } from "@/lib/browserApi";
import type { CatalogOffer } from "@/lib/offersCatalog";
import {
    applicationHref,
    type ApplicationStatus,
    fillTemplate,
    sortApplications,
    type VolunteerApplication,
} from "@/lib/volunteerApplications";

import { ApplicationSummary } from "./ApplicationSummary";

/** Сколько откликов показываем на телефоне — остальные в «Все отклики» */
const SHOWN_APPLICATIONS = 3;
/** Сколько откликов запрашиваем: живые выше отклонённых, поэтому берём с запасом */
const FETCH_APPLICATIONS = 10;

export interface VolunteerDashboardPhoneLabels {
    applications: string;
    /** «Все отклики ({{count}})» */
    all: string;
    status: Record<ApplicationStatus, string>;
    /** Что дальше — одна строка под статусом */
    next: Record<ApplicationStatus, string>;
    emptyTitle: string;
    emptyHint: string;
    find: string;
    loadError: string;
    retry: string;
    offers: string;
    offersAll: string;
    offersFresh: string;
    interests: string;
    offersEmpty: string;
    /** «Профиль заполнен на {{percent}} %» */
    profileFilled: string;
    profileDone: string;
    profileHint: string;
    complete: string;
    open: string;
    /** «Бесплатных откликов: {{left}} из {{total}}» */
    quota: string;
    quotaMember: string;
    membership: string;
    noTitle: string;
    favorite: { add: string; remove: string };
}

export interface PhoneOffer {
    offer: CatalogOffer;
    /** «Почему подходит» одной строкой, если есть */
    why?: string;
}

const section = "rounded-m-card border border-m-border bg-white shadow-m-card";
const sectionHead = "flex items-baseline justify-between gap-3 px-4 pt-4 pb-2";
const sectionTitle = "text-[18px] leading-[130%] font-bold text-ink-secondary";
const smallLink = "shrink-0 text-[14px] font-semibold text-primary no-underline";

/**
 * Кабинет волонтёра на телефоне (GS-291, ширина до 768 px): первым — «Мои отклики»
 * со статусом и тем, что дальше; ниже — 3–5 вакансий для вас (по интересам, без них —
 * свежие); профиль одной строкой с «Дополнить». Карточки и цвета — как в приложении
 * gs-mobile. На компьютере не показывается: там прежняя панель управления.
 */
export function VolunteerDashboardPhone({ enabled, hrefs, profile, offers, favorites, labels }: {
    /** Телефонная ширина: только тогда запрашиваем отклики */
    enabled: boolean;
    hrefs: { chat: string; offer: string; notes: string; catalog: string; preferences: string; membership: string };
    profile: {
        name: string;
        image?: string;
        /** 0…1; null — ещё не знаем */
        share: number | null;
        /** Куда ведёт «Дополнить»; нет — профиль заполнен */
        completeHref?: string;
        publicHref: string;
        /** Остаток бесплатных откликов; null — не загружен */
        quota: { member: boolean; left: number; total: number } | null;
    } | null;
    /** null — загружаются; fresh — это свежие вакансии, а не подбор */
    offers: { items: PhoneOffer[]; fresh: boolean; failed: boolean } | null;
    favorites: { enabled: boolean; isFavorite: (id: number) => boolean; isBusy: (id: number) => boolean; toggle: (id: number) => void };
    labels: VolunteerDashboardPhoneLabels;
}) {
    return (
        <div data-testid="volunteer-dashboard-phone" className="hidden flex-col gap-4 pb-8 down-md:flex">
            <Applications enabled={enabled} hrefs={hrefs} labels={labels} />
            <Offers offers={offers} hrefs={hrefs} favorites={favorites} labels={labels} />
            {profile && <ProfileLine profile={profile} membershipHref={hrefs.membership} labels={labels} />}
        </div>
    );
}

function Applications({ enabled, hrefs, labels }: {
    enabled: boolean;
    hrefs: { chat: string; offer: string; notes: string; catalog: string };
    labels: VolunteerDashboardPhoneLabels;
}) {
    const session = useSession();
    const [state, setState] = useState<{ items: VolunteerApplication[]; total: number } | "error" | null>(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!enabled || session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token)
            .GET("/api/v1/application/list-of-volunteer", { params: { query: { limit: String(FETCH_APPLICATIONS), page: "1" } } })
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error || !data) setState("error");
                else setState({ items: data.data ?? [], total: data.pagination?.total ?? data.data?.length ?? 0 });
            })
            .catch(() => !cancelled && setState("error"));
        return () => {
            cancelled = true;
        };
    }, [enabled, session.status, session.token, attempt]);

    const items = state && state !== "error" ? sortApplications(state.items).slice(0, SHOWN_APPLICATIONS) : [];
    const total = state && state !== "error" ? state.total : 0;

    return (
        <section aria-labelledby="phone-applications" className={section}>
            <div className={sectionHead}>
                <h2 id="phone-applications" className={sectionTitle}>{labels.applications}</h2>
                {total > SHOWN_APPLICATIONS && <a href={hrefs.notes} className={smallLink}>{fillTemplate(labels.all, { count: total })}</a>}
            </div>
            {state === null && <CardSkeleton count={2} />}
            {state === "error" && (
                <div className="flex flex-col items-center gap-3 px-4 pt-2 pb-5 text-center text-[14px] text-caption">
                    {labels.loadError}
                    <button
                        type="button"
                        onClick={() => {
                            setState(null);
                            setAttempt((value) => value + 1);
                        }}
                        className="h-10 cursor-pointer rounded-m-button border border-primary bg-white px-5 text-[14px] font-semibold text-primary"
                    >
                        {labels.retry}
                    </button>
                </div>
            )}
            {state !== null && state !== "error" && items.length === 0 && (
                <EmptyHint title={labels.emptyTitle} hint={labels.emptyHint} action={{ href: hrefs.catalog, label: labels.find }} className="pt-1" />
            )}
            {items.length > 0 && (
                <ul className="flex flex-col gap-2 px-3 pb-3">
                    {items.map((item) => (
                        <li key={item.id}>
                            <a href={applicationHref(item, hrefs)} className="flex gap-3 rounded-m-card bg-m-surface p-2.5 text-inherit no-underline">
                                <ApplicationSummary item={item} labels={{ status: labels.status, next: labels.next, noTitle: labels.noTitle }} />
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function Offers({ offers, hrefs, favorites, labels }: {
    offers: { items: PhoneOffer[]; fresh: boolean; failed: boolean } | null;
    hrefs: { offer: string; catalog: string; preferences: string };
    favorites: { enabled: boolean; isFavorite: (id: number) => boolean; isBusy: (id: number) => boolean; toggle: (id: number) => void };
    labels: VolunteerDashboardPhoneLabels;
}) {
    return (
        <section aria-labelledby="phone-offers" className={section}>
            <div className={sectionHead}>
                <h2 id="phone-offers" className={sectionTitle}>{labels.offers}</h2>
                <a href={hrefs.preferences} className={smallLink}>{labels.interests}</a>
            </div>
            {offers === null && <CardSkeleton count={3} big />}
            {offers && offers.fresh && offers.items.length > 0 && <p className="px-4 pb-2 text-[13px] leading-[140%] text-caption">{labels.offersFresh}</p>}
            {offers && offers.items.length === 0 && (
                <EmptyHint title={offers.failed ? labels.loadError : labels.offersEmpty} action={{ href: hrefs.catalog, label: labels.find }} className="pt-1" />
            )}
            {offers && offers.items.length > 0 && (
                <>
                    <ul className="flex flex-col gap-2 px-3">
                        {offers.items.map(({ offer, why }, index) => (
                            <li key={offer.id} className="relative">
                                <a href={hrefs.offer.replace("{id}", String(offer.id))} className="flex gap-3 rounded-m-card p-1.5 pr-10 text-inherit no-underline">
                                    {/* Первые две — сразу, остальные ниже первого экрана — лениво */}
                                    <Thumb src={offer.image} size={96} lazy={index > 1} />
                                    <span className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
                                        <span className="line-clamp-2 text-[15px] leading-[130%] font-bold text-ink-secondary">{offer.title?.trim() || labels.noTitle}</span>
                                        {offer.address && <span className="line-clamp-1 text-[13px] leading-[130%] text-caption">{offer.address}</span>}
                                        {offer.category && <span className="line-clamp-1 text-[13px] leading-[130%] text-primary">{offer.category}</span>}
                                        {why && <span className="line-clamp-2 text-[12px] leading-[130%] text-m-cta-text">{why}</span>}
                                    </span>
                                </a>
                                {favorites.enabled && (
                                    <button
                                        type="button"
                                        aria-label={favorites.isFavorite(offer.id) ? labels.favorite.remove : labels.favorite.add}
                                        aria-pressed={favorites.isFavorite(offer.id)}
                                        aria-busy={favorites.isBusy(offer.id) || undefined}
                                        onClick={() => favorites.toggle(offer.id)}
                                        className="absolute top-1 right-0 flex h-11 w-11 cursor-pointer items-center justify-center border-0 bg-transparent p-0 aria-busy:cursor-wait"
                                    >
                                        <svg aria-hidden width="22" height="20" viewBox="0 0 24 20" className={favorites.isFavorite(offer.id) ? "fill-status-rejected" : "fill-none stroke-caption"} strokeWidth="1.6">
                                            <path d="M12.1459 18.5C10.7363 17.1083 -1.49853 10.9923 2.02846 3.94676C5.91013 -3.30845 12.1459 3.94676 12.1459 3.94676M12.1459 18.5C13.5555 17.1083 25.7903 10.9923 22.2633 3.94676C18.3817 -3.30845 12.1459 3.94676 12.1459 3.94676" />
                                        </svg>
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                    <a href={hrefs.catalog} className="mx-3 my-3 flex h-12 items-center justify-center rounded-m-button border border-primary text-[16px] font-semibold text-primary no-underline">{labels.offersAll}</a>
                </>
            )}
        </section>
    );
}

function ProfileLine({ profile, membershipHref, labels }: {
    profile: NonNullable<Parameters<typeof VolunteerDashboardPhone>[0]["profile"]>;
    membershipHref: string;
    labels: VolunteerDashboardPhoneLabels;
}) {
    const percent = profile.share === null ? null : Math.round(profile.share * 100);
    const done = profile.share !== null && !profile.completeHref;
    const quota = profile.quota;
    return (
        <section aria-label={profile.name} className={`${section} flex flex-col gap-3 p-4`}>
            <div className="flex items-center gap-3">
                <Avatar src={profile.image} name={profile.name} size={48} loading="lazy" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate text-[16px] font-bold text-ink-secondary">{profile.name}</span>
                    {percent === null
                        ? <span aria-hidden className="h-4 w-32 animate-pulse rounded bg-m-surface" />
                        : <span className="text-[13px] leading-[130%] text-caption">{done ? labels.profileDone : fillTemplate(labels.profileFilled, { percent })}</span>}
                    {percent !== null && (
                        <span aria-hidden className="h-1.5 w-full overflow-hidden rounded-full bg-m-surface">
                            <span className="block h-full rounded-full bg-m-success" style={{ width: `${percent}%` }} />
                        </span>
                    )}
                </div>
                <a href={profile.completeHref ?? profile.publicHref} className="flex h-10 shrink-0 items-center rounded-m-button border border-primary bg-white px-4 text-[14px] font-semibold text-primary no-underline">
                    {profile.completeHref ? labels.complete : labels.open}
                </a>
            </div>
            {!done && percent !== null && <p className="text-[13px] leading-[140%] text-ink-secondary">{labels.profileHint}</p>}
            {quota && (
                <p className="flex items-center justify-between gap-3 border-t border-m-border pt-3 text-[13px] leading-[130%] text-ink-secondary">
                    <span>{quota.member ? labels.quotaMember : fillTemplate(labels.quota, { left: quota.left, total: quota.total })}</span>
                    {!quota.member && <a href={membershipHref} className={smallLink}>{labels.membership}</a>}
                </p>
            )}
        </section>
    );
}

/** Заготовка карточек, пока данные грузятся */
function CardSkeleton({ count, big = false }: { count: number; big?: boolean }) {
    return (
        <ul aria-hidden className="flex flex-col gap-2 px-3 pb-3">
            {Array.from({ length: count }, (_, index) => (
                <li key={index} className="flex gap-3 p-1.5">
                    <span className={`shrink-0 animate-pulse rounded-m-card bg-m-surface ${big ? "h-24 w-24" : "h-14 w-14"}`} />
                    <span className="flex flex-1 flex-col gap-2 py-1">
                        <span className="h-4 w-4/5 animate-pulse rounded bg-m-surface" />
                        <span className="h-3 w-1/2 animate-pulse rounded bg-m-surface" />
                        <span className="h-3 w-1/3 animate-pulse rounded bg-m-surface" />
                    </span>
                </li>
            ))}
        </ul>
    );
}
