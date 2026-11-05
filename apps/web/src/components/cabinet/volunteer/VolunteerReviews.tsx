"use client";

import type { components } from "@goodsurfing/api";
import { type UIEvent, useCallback, useEffect, useRef, useState } from "react";

import type { ImagesUploaderLabels } from "@/components/cabinet/ImagesUploader";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { useSession } from "@/components/session/SessionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { clearReviewLink, parseReviewLink } from "@/lib/reviewLink";
import { textSlice } from "@/lib/textSlice";

import { OfferReviewDialog, type OfferReviewDialogLabels } from "./OfferReviewDialog";
import { StarRating } from "./StarRating";

type Pending = components["schemas"]["ListVacancyWithoutReviewResult"];
type MyReview = components["schemas"]["ListVacancyReviewResult"];
type AboutMe = components["schemas"]["ListResult16"];
type Image = components["schemas"]["ImageResultDto"];

const PER_PAGE = 20;
/** В вертикальном слайдере видно три карточки (VerticalSlider старого фронта) */
const SLIDER_VISIBLE = 3;
const SLIDER_GAP = 20;
const SLIDER_MAX = 30;
const BADGE: Record<string, string> = { new: "bg-primary", accepted: "bg-host", canceled: "bg-status-rejected" };

export interface VolunteerReviewsLabels {
    title: string;
    yourRating: string;
    aboutOffers: string;
    recent: string;
    aboutYou: string;
    add: string;
    anonymousOrganization: string;
    anonymousUser: string;
    noTitle: string;
    noAddress: string;
    sendError: string;
    statuses: Record<string, string>;
    slider: { prev: string; next: string };
    gallery: ImagesUploaderLabels["gallery"];
    dialog: OfferReviewDialogLabels;
    photos: ImagesUploaderLabels;
}

/**
 * Постраничная лента с догрузкой при прокрутке панели на 70 % (InfiniteScroll
 * старого фронта). Перезагрузка, запрошенная во время загрузки страницы, не
 * теряется — выполняется следом; после ошибки лента не догружается на каждой
 * прокрутке (до следующей перезагрузки).
 */
function usePaged<T>(load: (page: number) => Promise<T[] | null>, enabled: boolean) {
    const [items, setItems] = useState<T[] | null>(null);
    const next = useRef(1);
    const more = useRef(true);
    /** Поколение ленты, чья загрузка сейчас идёт (null — ничего не грузится) */
    const busy = useRef<number | null>(null);
    const resetQueued = useRef(false);
    const generation = useRef(0);

    const fetchPage = useCallback(async (reset: boolean) => {
        if (busy.current !== null) {
            if (reset) resetQueued.current = true;
            return;
        }
        if (!reset && !more.current) return;
        const gen = generation.current;
        busy.current = gen;
        let fromStart = reset;
        try {
            for (;;) {
                const number = fromStart ? 1 : next.current;
                const page = await load(number).catch(() => null);
                if (gen !== generation.current) return;
                if (resetQueued.current) {
                    resetQueued.current = false;
                    fromStart = true;
                    continue;
                }
                if (!page) {
                    more.current = false;
                    if (fromStart) setItems((prev) => prev ?? []);
                    return;
                }
                next.current = number + 1;
                more.current = page.length >= PER_PAGE;
                setItems((prev) => (fromStart ? page : [...(prev ?? []), ...page]));
                return;
            }
        } finally {
            if (busy.current === gen) busy.current = null;
        }
    }, [load]);

    useEffect(() => {
        if (!enabled) return;
        generation.current += 1;
        busy.current = null;
        resetQueued.current = false;
        void fetchPage(true);
        return () => {
            generation.current += 1;
        };
    }, [enabled, fetchPage]);

    const onScroll = (event: UIEvent<HTMLElement>) => {
        const node = event.currentTarget;
        if (node.scrollTop + node.clientHeight >= node.scrollHeight * 0.7) void fetchPage(false);
    };
    return { items, onScroll, reload: () => fetchPage(true) };
}

function Thumbs({ images, label, onOpen }: { images: Image[]; label: string; onOpen: (index: number) => void }) {
    if (images.length === 0) return null;
    return (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
            {images.slice(0, 4).map((image, index) => (
                <button key={image.id} type="button" aria-label={`${label} ${index + 1}`} onClick={() => onOpen(index)} className="relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-[6px]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- превью из хранилища */}
                    <img loading="lazy" decoding="async" src={mediaUrl(image, "small")} alt="" className="block h-full w-full object-cover" />
                    {index === 3 && images.length > 4 && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[14px] font-semibold text-white">{`+${images.length - 4}`}</span>
                    )}
                </button>
            ))}
        </div>
    );
}

/**
 * «Отзывы» волонтёра (VolunteerReviewPage старого фронта): рейтинг, слева —
 * проекты без отзыва («Добавить отзыв», от четырёх — вертикальный слайдер по
 * три) и свои отзывы о проектах, справа — отзывы организаторов о волонтёре.
 * Обе панели листаются и догружают по 20 при прокрутке.
 */
export function VolunteerReviews({ hrefs, categories, labels }: {
    hrefs: { offer: string; volunteer: string };
    categories: Record<string, string>;
    labels: VolunteerReviewsLabels;
}) {
    const session = useSession();
    const enabled = session.status === "user";
    const profile = session.profile;
    const api = useCallback(() => browserApi(session.token), [session.token]);
    const [pending, setPending] = useState<Pending[] | null>(null);
    const [pendingVersion, setPendingVersion] = useState(0);
    const [selected, setSelected] = useState<Pending | null>(null);
    const [linkRating, setLinkRating] = useState<number | null>(null);
    const [slide, setSlide] = useState(0);
    const [gallery, setGallery] = useState<{ images: string[]; index: number } | null>(null);

    const loadMine = useCallback(async (page: number) => {
        const { data } = await api().GET("/api/v1/volunteer/vacancy/review/list", { params: { query: { page, limit: PER_PAGE } } });
        return data ? data.data ?? [] : null;
    }, [api]);
    const loadAboutMe = useCallback(async (page: number) => {
        const { data } = await api().GET("/api/v1/review-volunteer", { params: { query: { page, limit: PER_PAGE } } });
        return data ? data.data ?? [] : null;
    }, [api]);
    const mine = usePaged<MyReview>(loadMine, enabled);
    const aboutMe = usePaged<AboutMe>(loadAboutMe, enabled);

    useEffect(() => {
        if (!enabled) return;
        let cancelled = false;
        void api().GET("/api/v1/volunteer/vacancy/without-review/list")
            .then(({ data }) => {
                if (cancelled) return;
                const list = Array.isArray(data) ? data : [];
                setPending(list);
                // Пришли по звезде из письма — сразу окно отзыва на этот проект
                const link = parseReviewLink(window.location.search);
                if (!link) return;
                clearReviewLink();
                const target = list.find((item) => item.id === link.vacancyId);
                if (target) {
                    setLinkRating(link.rating);
                    setSelected(target);
                }
            })
            .catch(() => !cancelled && setPending([]));
        return () => {
            cancelled = true;
        };
    }, [enabled, api, pendingVersion]);

    const rating = Number((profile?.volunteer as { averageRating?: unknown } | undefined)?.averageRating) || 0;
    const author = profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || labels.anonymousUser : labels.anonymousUser;
    const openGallery = (images: Image[], index: number) => setGallery({ images: images.map((image) => mediaUrl(image, "large") ?? "").filter(Boolean), index });
    const panel = "h-full w-full overflow-auto border border-accent-bg bg-white p-5 down-lg:h-auto down-lg:max-w-none [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-accent-bg [&::-webkit-scrollbar-track]:bg-white";
    const h3 = "text-[1.17em] font-bold";

    const miniCard = (item: Pending) => (
        <div key={item.id} className="box-border flex w-full max-w-[380px] items-center justify-between gap-[5px] rounded-[3px] border border-[gray] px-[15px] py-3 down-lg:max-w-none down-lg:flex-wrap down-lg:gap-y-2.5">
            <a href={hrefs.offer.replace("{id}", String(item.id))} className="flex min-w-0 cursor-pointer gap-x-2 overflow-hidden text-inherit no-underline">
                <Avatar src={mediaUrl(item.image, "small")} name={item.name || labels.anonymousOrganization} size={30} />
                <span className="flex min-w-0 flex-col overflow-hidden whitespace-nowrap">
                    <span className="truncate text-[14px] text-primary">{item.name || labels.anonymousOrganization}</span>
                    <span className="truncate text-[12px] text-caption">{item.address}</span>
                </span>
            </a>
            <button type="button" onClick={() => setSelected(item)} className="flex h-8 max-w-[140px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-primary bg-primary px-4 py-[7px] text-[12px] text-white transition-all duration-300 hover:bg-white hover:text-primary">
                {labels.add}
            </button>
        </div>
    );

    if (!enabled || !mine.items || !aboutMe.items || !pending) {
        return <div className="h-full max-h-[calc(100vh-250px)] max-w-[820px]"><Spinner /></div>;
    }

    const sliderSlideHeight = (435 - 90 - SLIDER_GAP * (SLIDER_VISIBLE - 1)) / SLIDER_VISIBLE;
    // В слайдере не больше 30 карточек (как в старом фронте) — последний слайд считается от показанных
    const slides = pending.slice(0, SLIDER_MAX);
    const lastSlide = Math.max(0, slides.length - SLIDER_VISIBLE);
    const arrow = (direction: "prev" | "next", active: boolean) => (
        <button
            type="button"
            aria-label={direction === "prev" ? labels.slider.prev : labels.slider.next}
            disabled={!active}
            onClick={() => setSlide((value) => Math.max(0, Math.min(lastSlide, value + (direction === "prev" ? -1 : 1))))}
            className={`absolute left-[45%] z-10 box-content h-[30px] w-[30px] cursor-pointer p-2.5 select-none disabled:cursor-default ${direction === "prev" ? "top-0 rotate-90" : "bottom-0 rotate-[270deg]"}`}
        >
            <svg aria-hidden width="20" height="38" viewBox="0 0 20 38" className="mx-auto h-[30px]">
                <path fill={active ? "#3dabf7" : "#8494A1"} d="M2.59 19 19.68 1.84a1.08 1.08 0 0 0 0-1.52 1.07 1.07 0 0 0-1.51 0L.32 18.24a1.08 1.08 0 0 0 0 1.52l17.85 17.92c.21.21.49.32.76.32s.55-.1.75-.32a1.08 1.08 0 0 0 0-1.52z" />
            </svg>
        </button>
    );

    return (
        <div className="max-h-[calc(100vh-250px)] w-full max-w-[820px] down-lg:max-w-none">
            <div className="flex w-full justify-between gap-2.5 down-lg:text-center max-[567px]:flex-wrap max-[567px]:justify-center">
                <h2 className="text-[1.625rem] leading-8 font-normal">{labels.title}</h2>
                {/* В старом фронте при нулевом рейтинге здесь выводился одинокий «0» */}
                {rating > 0 && (
                    <div className="flex items-center justify-center">
                        <span className="text-[14px]">{labels.yourRating}</span>
                        <StarRating value={rating} label={`${labels.yourRating}: ${rating}`} />
                        <span className="text-[18px] font-medium">{Number(rating.toFixed(1))}</span>
                    </div>
                )}
            </div>
            <div className="mt-[30px] flex h-full gap-x-[30px] down-lg:flex-col">
                <section aria-label={labels.aboutOffers} onScroll={mine.onScroll} className={`max-w-[820px] ${panel}`}>
                    <h3 className={h3}>{labels.aboutOffers}</h3>
                    <p className="mt-[30px]">{labels.recent}</p>
                    {pending.length > 0 && (pending.length >= 4 ? (
                        <div className="relative mt-5 box-border flex h-[435px] w-full justify-center overflow-hidden py-[45px]">
                            <div className="w-full overflow-hidden">
                                <div className="flex flex-col transition-transform duration-300" style={{ gap: SLIDER_GAP, transform: `translateY(-${slide * (sliderSlideHeight + SLIDER_GAP)}px)` }}>
                                    {slides.map((item) => (
                                        <div key={item.id} className="flex shrink-0 items-center justify-center" style={{ height: sliderSlideHeight }}>{miniCard(item)}</div>
                                    ))}
                                </div>
                            </div>
                            {/* Стрелки — когда карточек больше, чем видно (в старом фронте — только от пяти) */}
                            {arrow("next", slide < lastSlide)}
                            {arrow("prev", slide > 0)}
                        </div>
                    ) : (
                        <div className="mt-5 flex w-full flex-col gap-5">{pending.map(miniCard)}</div>
                    ))}
                    <div className="mt-5 flex flex-col gap-y-5">
                        <div>
                            {mine.items.map((review) => (
                                <article key={review.id} className="mt-2.5 box-border flex min-h-[100px] w-full max-w-[500px] flex-col justify-between gap-y-4 rounded-[3px] border border-accent-bg p-5 down-lg:max-w-none">
                                    <a href={hrefs.offer.replace("{id}", String(review.vacancy.id))} className="flex w-full cursor-pointer flex-col gap-y-2 text-inherit no-underline">
                                        <span className="flex justify-between gap-x-[5px] down-sm:flex-col-reverse down-sm:flex-wrap down-sm:gap-y-2.5">
                                            <span className="text-[18px] font-medium text-ink-secondary">{textSlice(review.vacancy.name, 34, labels.noTitle)}</span>
                                            {review.vacancy.image?.thumbnails
                                                // eslint-disable-next-line @next/next/no-img-element -- превью вакансии
                                                ? <img loading="lazy" decoding="async" src={mediaUrl(review.vacancy.image, "small")} alt="" className="h-10 w-10 rounded-[3px] object-cover" />
                                                : <span className="h-10 w-10 rounded-[3px] bg-accent-bg" />}
                                        </span>
                                        <span className="text-[12px] text-caption">{textSlice(review.created, 30, "")}</span>
                                    </a>
                                    <p className="text-[14px] font-medium text-ink-secondary">{review.description}</p>
                                    <Thumbs images={review.images ?? []} label={labels.gallery.photo} onOpen={(index) => openGallery(review.images ?? [], index)} />
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <StarRating value={Number(review.rating) || 0} size={15} />
                                        <span className="ml-[3px] text-[14px] font-bold text-ink-secondary">{Number(review.rating) || 0}</span>
                                        {profile && (
                                            <a href={hrefs.volunteer.replace("{id}", profile.id)} className="flex cursor-pointer items-center gap-x-[5px] text-inherit no-underline">
                                                <Avatar src={mediaUrl(profile.image, "small")} name={author} size={22} />
                                                <span className="text-[14px]">{textSlice(author, 50, labels.noTitle)}</span>
                                            </a>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
                <section aria-label={labels.aboutYou} onScroll={aboutMe.onScroll} className={panel}>
                    <h3 className={h3}>{labels.aboutYou}</h3>
                    <div className="mt-[30px] flex flex-col gap-y-[30px]">
                        {/* В старом фронте отступ 30 px был у обёртки ленты, а карточки шли вплотную */}
                        <div className="flex flex-col gap-y-[30px]">
                            {aboutMe.items.map((review) => {
                                const name = `${review.author.firstName || ""} ${review.author.lastName || ""}`.trim() || labels.anonymousUser;
                                const place = review.author.country && review.author.city ? `${review.author.country}, ${review.author.city}` : review.author.country || review.author.city || "";
                                return (
                                    <article key={review.id} className="flex min-h-[100px] max-w-[500px] flex-col justify-between rounded-[3px] border border-accent-bg px-5 py-4 down-lg:max-w-none">
                                        <div className="flex w-full flex-wrap justify-between gap-y-2.5">
                                            <div className="flex gap-x-[5px]">
                                                <Avatar src={mediaUrl(review.author.image, "small")} name={name} size={22} />
                                                <div className="flex flex-col gap-y-1">
                                                    <span className="text-[14px] text-primary">{name}</span>
                                                    <span className="text-[12px] text-caption">{place}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-[5px]">
                                                <StarRating value={Number(review.rating) || 0} size={15} />
                                                <span className="text-[14px]">{Number(review.rating) || 0}</span>
                                            </div>
                                        </div>
                                        <p className="mt-3">{review.description}</p>
                                        <Thumbs images={review.images ?? []} label={labels.gallery.photo} onOpen={(index) => openGallery(review.images ?? [], index)} />
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
            <OfferReviewDialog
                open={!!selected}
                labels={labels.dialog}
                photos={{ token: session.token, labels: labels.photos, error: labels.sendError }}
                assistant={selected ? { token: session.token, vacancyId: selected.id } : undefined}
                initialRating={linkRating}
                onClose={() => {
                    setSelected(null);
                    setLinkRating(null);
                }}
                offer={selected && (
                    <div className="flex min-h-[100px] w-full flex-col border border-accent-bg bg-white p-3.5 select-none">
                        {labels.statuses[selected.applicationStatus] && (
                            <div className={`box-content max-h-min max-w-min self-end rounded-[2px] px-1.5 py-[3px] text-[10px] text-white ${BADGE[selected.applicationStatus] ?? "bg-primary"}`}>{labels.statuses[selected.applicationStatus]}</div>
                        )}
                        <a href={hrefs.offer.replace("{id}", String(selected.id))} className="mt-1 flex gap-2 text-inherit no-underline">
                            <Avatar src={mediaUrl(selected.image, "medium")} name={selected.name} size={56} />
                            <div className="flex flex-col gap-1">
                                <span className="text-[14px] font-medium text-ink">{textSlice(selected.name, 45, labels.noTitle)}</span>
                                <span className="text-[12px] font-medium text-caption">{textSlice(selected.address, 23, labels.noAddress)}</span>
                                <span className="text-[12px] font-medium text-primary">{(() => {
                                    const name = (selected.categories[0] as { name?: string } | undefined)?.name?.trim();
                                    return name ? categories[name] ?? name : null;
                                })()}</span>
                            </div>
                        </a>
                    </div>
                )}
                onSend={async ({ rating: stars, text, imageIds }) => {
                    if (!selected) return labels.sendError;
                    const { error } = await api().POST("/api/v1/review-vacancy", {
                        body: { vacancyId: selected.id, rating: stars as never, description: text, imageIds },
                    }).catch(() => ({ error: true }));
                    if (error) {
                        const { detail, message } = (typeof error === "object" ? error : {}) as { detail?: unknown; message?: unknown };
                        return typeof detail === "string" ? detail : typeof message === "string" ? message : labels.sendError;
                    }
                    setPendingVersion((value) => value + 1);
                    void mine.reload();
                    return null;
                }}
            />
            <GalleryLightbox images={gallery?.images ?? []} index={gallery?.index ?? null} onClose={() => setGallery(null)} labels={labels.gallery} />
        </div>
    );
}
