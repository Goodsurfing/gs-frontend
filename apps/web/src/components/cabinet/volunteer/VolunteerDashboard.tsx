"use client";

import type { components } from "@goodsurfing/api";
import { useEffect, useState } from "react";

import { MemberBanner } from "@/components/content/MemberBanner";
import { OfferListCard, type OfferListCardLabels } from "@/components/offers-map/OfferListCard";
import { ReviewReminders, type ReviewRemindersLabels } from "@/components/cabinet/ReviewReminders";
import { useFavoriteOffers } from "@/components/offers/useFavoriteOffers";
import { useSession } from "@/components/session/SessionProvider";
import { Spinner } from "@/components/ui/Spinner";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import type { CatalogOffer } from "@/lib/offersCatalog";
import { whyText, type WhyLabels } from "@/lib/recommendations";

import { Doughnut } from "./Doughnut";

type Occupancy = components["schemas"]["OccupancyResult"];

/** Сколько бесплатных откликов в год без членства (shared/constants/membership старого фронта) */
const FREE_APPLICATIONS_LIMIT = 3;
/** Дата первого визита на дашборд — тот же ключ localStorage, что у старого фронта */
const NOTIFICATION_DATE_KEY = "firstNotificationDate";

export interface VolunteerDashboardLabels {
    reviewReminders: ReviewRemindersLabels;
    fill: string;
    viewProfile: string;
    edit: string;
    points: { about: string; skills: string; photo: string; video: string; blog: string; membership: string };
    quota: { unlimited: string; left: string; renew: string; more: string };
    offers: string;
    settings: string;
    banner: string;
    bannerButton: string;
    notifications: string;
    welcome: string;
    welcomeText: string;
    card: OfferListCardLabels;
    favorite: { add: string; remove: string };
    /** «Почему подходит» под рекомендацией (GS-256); {value} — что совпало */
    why: WhyLabels;
}

interface Reason { type: string; value: string }

const card = "bg-white shadow-[0_5px_20px_rgba(14,29,39,0.05)]";
const cardTop = "flex justify-between border-b border-caption px-5 py-[13px]";
const h3 = "text-[1.17em] font-bold";

/**
 * Панель управления волонтёра (VolunteerDashboardPage старого фронта):
 * заполненность профиля и остаток бесплатных откликов, вакансии любимых
 * направлений, баннер членства (без членства) и уведомления.
 */
export function VolunteerDashboard({ locale, hrefs, categories, labels }: {
    locale: Locale;
    hrefs: { volunteer: string; skills: string; preferences: string; membership: string; offer: string; review: string };
    categories: Record<string, string>;
    labels: VolunteerDashboardLabels;
}) {
    const session = useSession();
    const favorites = useFavoriteOffers();
    const profile = session.status === "user" ? session.profile : null;
    const [occupancy, setOccupancy] = useState<Occupancy | null>(null);
    const [offers, setOffers] = useState<CatalogOffer[] | null>(null);
    // Подбор под волонтёра (направления, навыки, языки, прошлые поездки); пусто — подборка по любимым направлениям
    const [picked, setPicked] = useState<{ offers: CatalogOffer[]; reasons: Record<number, Reason[]> } | null>(null);
    const [date, setDate] = useState("");
    const favorite = (profile?.favoriteCategories ?? []).join(",");

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token).GET("/api/v1/profile/occupancy")
            .then(({ data }) => !cancelled && data && setOccupancy(data))
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token]);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        const api = browserApi(session.token);
        void api.GET("/api/v1/assistant/recommendations", { params: { query: { lang: locale } } })
            .then(async ({ data }) => {
                const list = (Array.isArray(data) ? data : []) as { id: number; reasons: Reason[] }[];
                if (list.length === 0) {
                    if (!cancelled) setPicked({ offers: [], reasons: {} });
                    return;
                }
                const cards = await api.GET("/api/v1/vacancy", { params: { query: { "ids[]": list.map((item) => item.id), fields: "card", limit: list.length } } });
                if (cancelled) return;
                const byId = new Map((cards.data?.data ?? []).map((offer) => [offer.id, offer]));
                setPicked({
                    offers: list.map((item) => byId.get(item.id)).filter((offer) => offer !== undefined).map((offer) => toCard(offer, categories)),
                    reasons: Object.fromEntries(list.map((item) => [item.id, item.reasons])),
                });
            })
            .catch(() => !cancelled && setPicked({ offers: [], reasons: {} }));
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, locale, categories]);

    useEffect(() => {
        if (session.status !== "user" || !favorite) return;
        let cancelled = false;
        void browserApi(session.token)
            .GET("/api/v1/vacancy", { params: { query: { "categoryIds[]": favorite.split(",").map(Number), sort: "recommendation", fields: "card", limit: 10 } } })
            .then(({ data }) => {
                if (cancelled) return;
                setOffers((data?.data ?? []).slice(0, 10).map((offer) => toCard(offer, categories)));
            })
            .catch(() => !cancelled && setOffers([]));
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, favorite, categories]);

    useEffect(() => {
        try {
            const saved = window.localStorage.getItem(NOTIFICATION_DATE_KEY);
            // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage есть только в браузере
            if (saved) setDate(saved);
            else {
                const now = new Date().toDateString();
                window.localStorage.setItem(NOTIFICATION_DATE_KEY, now);
                setDate(now);
            }
        } catch {
            setDate(new Date().toDateString());
        }
    }, []);

    const points = [
        // Имя и рассказ о себе — тоже часть профиля (аудит 29.10 в старом фронте)
        { text: labels.points.about, done: Boolean(profile?.firstName?.trim() && profile?.aboutMe?.trim()) },
        { text: labels.points.skills, done: !!occupancy?.isSkill },
        { text: labels.points.photo, done: !!occupancy?.isPhoto },
        { text: labels.points.video, done: !!occupancy?.isVideo },
        { text: labels.points.blog, done: !!occupancy?.isBlogPost },
        { text: labels.points.membership, done: !!occupancy?.isMembership },
    ];
    // Подбор под волонтёра, если нашёлся; иначе — по любимым направлениям (без них подборки нет)
    const fallback = profile && !favorite ? [] : offers;
    const shownOffers = picked === null ? null : picked.offers.length > 0 ? picked.offers : fallback;
    const reasonsOf = (id: number) => (picked?.offers.length ? picked.reasons[id] ?? [] : []);
    const share = points.filter((point) => point.done).length / points.length;

    return (
        <div className="w-full max-w-[1400px]">
            {profile && (
                <section className={`flex w-full flex-col ${card}`}>
                    <div className={`${cardTop} flex-wrap max-[567px]:gap-y-2.5`}>
                        <h3 className={h3}>{labels.fill}</h3>
                        <a href={hrefs.volunteer.replace("{id}", profile.id)} className="text-primary no-underline">{labels.viewProfile}</a>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-y-[30px] px-6 py-4 down-lg:flex-col-reverse down-lg:gap-y-2.5">
                        <div className="mt-[18px] flex flex-col gap-[38px]">
                            <ul className="flex flex-wrap gap-[30px]">
                                {points.map((point) => (
                                    <li key={point.text} className="flex items-center">
                                        <span aria-hidden className={`mb-0.5 h-3 w-3 rounded-full ${point.done ? "bg-cta" : "bg-caption"}`} />
                                        <span className="ml-2.5 text-ink">{point.text}</span>
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <a href={hrefs.skills} className="inline-flex items-center justify-center rounded-[10px] border border-cta bg-cta px-[50px] py-2.5 text-center text-label text-white no-underline transition-all duration-300 hover:bg-white hover:text-cta max-[567px]:flex max-[567px]:w-full max-[567px]:p-2.5">
                                    {labels.edit}
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start gap-8 down-sm:flex-col down-sm:items-center down-sm:gap-5">
                            <Doughnut share={share}>{`${Math.round(share * 100)}%`}</Doughnut>
                            {occupancy && <Quota occupancy={occupancy} href={hrefs.membership} labels={labels.quota} />}
                        </div>
                    </div>
                </section>
            )}
            <ReviewReminders side="volunteer" reviewHref={hrefs.review} labels={labels.reviewReminders} className="mt-[1.875rem]" />
            <div className="grid grid-cols-[2fr_1fr] gap-[1.875rem] pt-[1.875rem] pb-14 down-lg:grid-cols-1">
                <section className={`w-full max-w-[1000px] ${card}`}>
                    <div className={`${cardTop} down-sm:flex-wrap down-sm:gap-y-2.5`}>
                        <h3 className={h3}>{labels.offers}</h3>
                        <a href={hrefs.preferences} className="text-primary no-underline">{labels.settings}</a>
                    </div>
                    <div>
                        {shownOffers === null ? <Spinner /> : shownOffers.map((offer) => (
                            <div key={offer.id}>
                                <OfferListCard
                                    offer={offer}
                                    href={hrefs.offer.replace("{id}", String(offer.id))}
                                    wide={false}
                                    labels={labels.card}
                                    favorite={favorites.enabled ? { active: favorites.isFavorite(offer.id), busy: favorites.isBusy(offer.id), labels: labels.favorite, onToggle: () => void favorites.toggleFavorite(offer.id) } : undefined}
                                />
                                {reasonsOf(offer.id).length > 0 && (
                                    <p className="mx-5 mt-2.5 mb-4 text-[12px] leading-[140%] text-cta-hover">
                                        <b>{labels.why.title}</b> {reasonsOf(offer.id).map((reason) => whyText(reason, labels.why, locale)).filter(Boolean).join(" · ")}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
                <div className="flex w-full max-w-[468px] flex-col down-lg:max-w-none">
                    {/* Как в старом фронте: баннер и пока занятость не загружена (или не ответила) */}
                    {!occupancy?.isMembership && (
                        <MemberBanner locale={locale} title={labels.banner} button={labels.bannerButton} className="down-lg:max-w-none" />
                    )}
                    <section className={`w-full max-w-[486px] ${card} down-lg:max-w-none`}>
                        <div className="flex items-center justify-between border-b-2 border-accent-bg bg-white px-5 py-3.5">
                            <h3 className="text-[1.125rem] font-semibold">{labels.notifications}</h3>
                        </div>
                        <div className="flex min-h-[450px] flex-col gap-3.5 bg-white p-[30px]">
                            <div className="flex cursor-pointer flex-col">
                                <p className="text-[14px] font-bold text-primary">{labels.welcome}</p>
                                <p className="mt-[3px] text-[12px] font-medium text-[#82949F]">{date}</p>
                                <p className="mt-[3px] text-[12px] leading-4 text-ink-secondary">{labels.welcomeText}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

/**
 * Остаток бесплатных откликов (FreeApplicationsCounter + QuotaDiagram старого
 * фронта, GS-171/188): кольцо — сколько осталось из трёх; с членством — ∞.
 */
function Quota({ occupancy, href, labels }: { occupancy: Occupancy; href: string; labels: VolunteerDashboardLabels["quota"] }) {
    const unlimited = occupancy.isMembership;
    const remaining = Math.max(0, Math.min(occupancy.remainingFreeApplications ?? 0, FREE_APPLICATIONS_LIMIT));
    const share = unlimited ? 1 : remaining / FREE_APPLICATIONS_LIMIT;
    const size = 110;
    const stroke = Math.round(size * 0.25);
    const radius = (size - stroke) / 2;
    const length = 2 * Math.PI * radius;

    return (
        <div className="flex max-w-[220px] shrink-0 flex-col items-center gap-3 text-center">
            <div className="relative shrink-0" style={{ width: size, height: size }}>
                <svg aria-hidden width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
                    <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} fill="none" style={{ stroke: "var(--color-accent-bg)" }} />
                    {share > 0 && (
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            strokeWidth={stroke}
                            fill="none"
                            style={{ stroke: "var(--color-host)" }}
                            strokeDasharray={`${length * share} ${length}`}
                            transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        />
                    )}
                </svg>
                <span data-testid="quota-value" className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-ink-secondary ${unlimited ? "text-[26px] font-medium" : "text-[14px] font-bold"}`}>
                    {unlimited ? "∞" : `${remaining}/${FREE_APPLICATIONS_LIMIT}`}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-[14px] font-semibold text-ink-secondary">{unlimited ? labels.unlimited : labels.left}</span>
                <a href={href} className="text-[13px] leading-[1.3] whitespace-pre-line text-primary underline">{unlimited ? labels.renew : labels.more}</a>
            </div>
        </div>
    );
}

/** Поля карточки вакансии из списка API (fields=card), которые нужны дашборду */
interface CardOffer {
    id: number;
    title: string;
    shortDescription: string;
    image?: Parameters<typeof mediaUrl>[0];
    address: string;
    categories: { name?: string | null }[];
    averageRating?: unknown;
    reviewsCount: number;
    acceptedApplicationsCount: number;
    status?: unknown;
}

/** Карточка вакансии из списка API (fields=card) */
function toCard(offer: CardOffer, categories: Record<string, string>): CatalogOffer {
    const name = offer.categories[0]?.name?.trim();
    return {
        id: offer.id,
        title: offer.title,
        description: offer.shortDescription,
        image: mediaUrl(offer.image, "medium"),
        address: offer.address,
        category: name ? categories[name] ?? name : undefined,
        rating: Number(offer.averageRating) || 0,
        reviews: offer.reviewsCount,
        went: offer.acceptedApplicationsCount,
        active: String(offer.status) === "active",
        // Отметки «нет на карте» на дашборде старого фронта не было
        onMap: true,
    };
}
