"use client";

import type { components } from "@goodsurfing/api";
import { useCallback, useEffect, useState } from "react";

import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { ShowNext } from "@/components/offer/ShowNext";
import { useSession } from "@/components/session/SessionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { Loading } from "@/components/ui/Loading";
import { StarRating } from "@/components/ui/StarRating";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { textSlice } from "@/lib/textSlice";

import { HostReviewDialog, type HostReviewDialogLabels } from "./HostReviewDialog";
import { useMyOrganization } from "./useMyOrganization";

type Waiting = components["schemas"]["ListVolunteerWithoutReviewResult"];
type MyReview = components["schemas"]["ListVolunteerReviewResult"];
type OfferReview = components["schemas"]["ListResult15"];
type Image = components["schemas"]["ImageResultDto"];

const PER_PAGE = 20;
/** Слайдер «без отзыва» показывает не больше 30 волонтёров (VerticalSlider старого фронта) */
const SLIDER_LIMIT = 30;

export interface HostReviewsLabels {
    title: string;
    yourRating: string;
    aboutVolunteers: string;
    recentlyAccepted: string;
    aboutOffers: string;
    addReview: string;
    noAddress: string;
    noTitle: string;
    anonymous: string;
    showNext: string;
    up: string;
    down: string;
    rating: string;
    gallery: { close: string; prev: string; next: string; photo: string };
    dialog: HostReviewDialogLabels;
}

const name = (person: { firstName?: string | null; lastName?: string | null } | null | undefined, anonymous: string) =>
    `${person?.firstName ?? ""} ${person?.lastName ?? ""}`.trim() || anonymous;
const place = (person: { country?: string | null; city?: string | null }) =>
    (person.country && person.city ? `${person.country}, ${person.city}` : person.country || person.city || "");

/**
 * Отзывы организатора (HostReviewPage старого фронта): слева — волонтёры,
 * которым ещё нет отзыва, и мои отзывы о волонтёрах; справа — отзывы
 * волонтёров о вакансиях организации. Списки — по 20, дальше «Посмотреть
 * следующие» (в старом бесконечная прокрутка не срабатывала).
 */
export function HostReviews({ volunteerHref, offerHref, labels }: {
    /** Адрес волонтёра с {id} */
    volunteerHref: string;
    /** Адрес вакансии с {id} */
    offerHref: string;
    labels: HostReviewsLabels;
}) {
    const session = useSession();
    const { organization, failed } = useMyOrganization();
    const [waiting, setWaiting] = useState<Waiting[] | null>(null);
    const [mine, setMine] = useState<{ items: MyReview[]; total: number; page: number } | null>(null);
    const [offers, setOffers] = useState<{ items: OfferReview[]; total: number; page: number } | null>(null);
    const [busy, setBusy] = useState(false);
    const [selected, setSelected] = useState<Waiting | null>(null);
    const [gallery, setGallery] = useState<{ images: string[]; index: number } | null>(null);

    const loadWaiting = useCallback(async () => {
        const { data } = await browserApi(session.token).GET("/api/v1/organization/volunteer/without-review/list").catch(() => ({ data: undefined }));
        setWaiting(Array.isArray(data) ? data : []);
    }, [session.token]);

    const loadMine = useCallback(async (page: number) => {
        const { data } = await browserApi(session.token)
            .GET("/api/v1/organization/volunteer/review/list", { params: { query: { page, limit: PER_PAGE } } })
            .catch(() => ({ data: undefined }));
        setMine((prev) => ({ items: [...(page > 1 ? prev?.items ?? [] : []), ...(data?.data ?? [])], total: data?.pagination?.total ?? 0, page }));
    }, [session.token]);

    const loadOffers = useCallback(async (page: number) => {
        const { data } = await browserApi(session.token)
            .GET("/api/v1/review-vacancy", { params: { query: { page, limit: PER_PAGE } } })
            .catch(() => ({ data: undefined }));
        setOffers((prev) => ({ items: [...(page > 1 ? prev?.items ?? [] : []), ...(data?.data ?? [])], total: data?.pagination?.total ?? 0, page }));
    }, [session.token]);

    useEffect(() => {
        if (session.status !== "user") return;
        // Три списка страницы — после того, как сессия узнала вошедшего
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void Promise.all([loadWaiting(), loadMine(1), loadOffers(1)]);
    }, [session.status, loadWaiting, loadMine, loadOffers]);

    // Организация нужна только для рейтинга: не загрузилась — списки всё равно показываются
    if (!organization && !failed) return <Loading className="min-h-[300px]" />;
    const rating = organization?.averageRating ?? 0;
    const more = async (load: (page: number) => Promise<void>, page: number) => {
        setBusy(true);
        await load(page + 1);
        setBusy(false);
    };
    const openGallery = (images: Image[], index: number) => setGallery({ images: images.map((image) => mediaUrl(image) ?? ""), index });
    const href = (template: string, id: string | number) => template.replace("{id}", String(id));

    return (
        <div className="h-full max-h-[calc(100vh-250px)] max-w-[820px] down-lg:max-w-none">
            <div className="flex w-full flex-wrap items-center justify-between gap-x-2.5 down-sm:justify-center">
                <h2 className="text-[1.625rem] leading-8 font-normal">{labels.title}</h2>
                {/* В старом при рейтинге 0 вместо блока выводился одинокий «0» */}
                {rating > 0 && (
                    <div className="flex items-center justify-center">
                        <span className="text-[14px]">{labels.yourRating}</span>
                        <StarRating value={rating} label={labels.rating} />
                        <span className="text-[18px]">{Number(rating.toFixed(1))}</span>
                    </div>
                )}
            </div>
            <div className="mt-[30px] flex h-full gap-x-[30px] down-lg:flex-col">
                <section className="box-border w-full max-w-[820px] overflow-y-auto border border-accent-bg bg-white p-5 down-lg:max-w-none down-sm:h-auto">
                    <h3 className="text-[1.17em] font-bold">{labels.aboutVolunteers}</h3>
                    <p className="mt-[30px]">{labels.recentlyAccepted}</p>
                    {waiting === null || mine === null ? <Loading className="min-h-[200px]" /> : (
                        <>
                            {waiting.length > 0 && waiting.length < 4 && (
                                <div className="flex w-full flex-col gap-5 pt-5">
                                    {waiting.map((item) => <WaitingCard key={`${item.id}-${item.vacancyId}`} item={item} href={href(volunteerHref, item.id)} onReview={() => setSelected(item)} labels={labels} />)}
                                </div>
                            )}
                            {waiting.length >= 4 && (
                                <VerticalSlider labels={labels}>
                                    {waiting.slice(0, SLIDER_LIMIT).map((item) => <WaitingCard key={`${item.id}-${item.vacancyId}`} item={item} href={href(volunteerHref, item.id)} onReview={() => setSelected(item)} labels={labels} />)}
                                </VerticalSlider>
                            )}
                            <div className="mt-[30px] flex flex-col">
                                {mine.items.map((review) => (
                                    <div key={review.id} className="mt-2.5 flex min-h-[100px] max-w-[500px] flex-col justify-between rounded-[3px] border border-accent-bg px-5 py-4 down-lg:max-w-none">
                                        <div className="flex w-full flex-wrap justify-between gap-y-2.5">
                                            <div className="flex gap-x-[5px]">
                                                <Avatar src={mediaUrl(review.volunteer.image, "small")} name={name(review.volunteer, labels.anonymous)} size={22} />
                                                <div className="flex flex-col gap-y-1">
                                                    <span className="text-[14px] text-primary">{name(review.volunteer, labels.anonymous)}</span>
                                                    <span className="text-[12px] text-caption">{place(review.volunteer)}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-[5px]">
                                                <StarRating value={Number(review.rating)} size={15} label={labels.rating} />
                                                <span className="text-[14px]">{Number(review.rating)}</span>
                                            </div>
                                        </div>
                                        <p className="mt-3">{review.description}</p>
                                        <Thumbs images={review.images} onOpen={(index) => openGallery(review.images, index)} />
                                    </div>
                                ))}
                                {mine.items.length < mine.total && <div className="mt-2.5"><ShowNext onClick={() => void more(loadMine, mine.page)} disabled={busy} label={labels.showNext} /></div>}
                            </div>
                        </>
                    )}
                </section>
                <section className="box-border w-full overflow-auto border border-accent-bg p-5 down-lg:max-w-none down-sm:h-auto">
                    <h3 className="text-[1.17em] font-bold">{labels.aboutOffers}</h3>
                    <div className="mt-5 flex flex-col">
                        {offers?.items.map((review) => (
                            <div key={review.id} className="mt-2.5 box-border flex min-h-[100px] w-full max-w-[500px] flex-col justify-between gap-y-4 rounded-[3px] border border-accent-bg p-5 down-lg:max-w-none">
                                <a href={href(offerHref, review.vacancy.id)} className="flex w-full flex-col gap-y-2 text-inherit no-underline">
                                    <div className="flex justify-between gap-x-[5px] down-sm:flex-col-reverse down-sm:flex-wrap down-sm:gap-y-2.5">
                                        <span className="text-[18px] font-medium text-ink-secondary">{textSlice(review.vacancy.name, 34, labels.noTitle)}</span>
                                        {review.vacancy.image?.thumbnails?.small
                                            // eslint-disable-next-line @next/next/no-img-element -- обложка вакансии
                                            ? <img src={mediaUrl(review.vacancy.image, "small")} alt="" className="h-10 w-10 rounded-[3px] object-cover" />
                                            : <div className="h-10 w-10 rounded-[3px] bg-accent-bg" />}
                                    </div>
                                    <span className="text-[12px] text-caption">{textSlice(review.created, 30, "")}</span>
                                </a>
                                <p className="text-[14px] font-medium text-ink-secondary">{review.description}</p>
                                <Thumbs images={review.images} onOpen={(index) => openGallery(review.images, index)} />
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <StarRating value={Number(review.rating)} size={15} label={labels.rating} />
                                    <span className="ml-[3px] text-[14px] font-bold text-ink-secondary">{Number(review.rating)}</span>
                                    <a href={href(volunteerHref, review.author.id)} className="flex items-center gap-x-[5px] text-inherit no-underline">
                                        <Avatar src={mediaUrl(review.author.image, "small")} name={name(review.author, labels.anonymous)} size={22} />
                                        <span className="text-[14px]">{textSlice(name(review.author, labels.anonymous), 50, "")}</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                        {offers && offers.items.length < offers.total && <div className="mt-2.5"><ShowNext onClick={() => void more(loadOffers, offers.page)} disabled={busy} label={labels.showNext} /></div>}
                    </div>
                </section>
            </div>
            <HostReviewDialog
                volunteer={selected && { vacancyId: selected.vacancyId, volunteerId: selected.id, firstName: selected.firstName, lastName: selected.lastName, image: selected.image, country: selected.country, city: selected.city, status: selected.statusApplication }}
                volunteerHref={selected ? href(volunteerHref, selected.id) : ""}
                onClose={() => setSelected(null)}
                onSent={() => void Promise.all([loadWaiting(), loadMine(1)])}
                labels={labels.dialog}
            />
            <GalleryLightbox images={gallery?.images ?? []} index={gallery?.index ?? null} onClose={() => setGallery(null)} labels={labels.gallery} />
        </div>
    );
}

function WaitingCard({ item, href, onReview, labels }: { item: Waiting; href: string; onReview: () => void; labels: HostReviewsLabels }) {
    const person = name(item, labels.anonymous);
    return (
        <div className="box-border flex h-full w-full max-w-[380px] items-center justify-between gap-[5px] rounded-[3px] border border-[gray] px-[15px] py-3 down-lg:max-w-none down-lg:flex-wrap down-lg:gap-y-2.5">
            <a href={href} className="flex min-w-0 gap-x-2 overflow-hidden text-inherit no-underline">
                <Avatar src={mediaUrl(item.image, "small")} name={person} size={30} />
                <span className="flex min-w-0 flex-col overflow-hidden whitespace-nowrap">
                    <span className="overflow-hidden text-[14px] text-ellipsis text-primary">{textSlice(person, 50, "")}</span>
                    <span className="overflow-hidden text-[12px] text-ellipsis text-caption">{textSlice(item.country, 25, labels.noAddress)}</span>
                </span>
            </a>
            <button
                type="button"
                onClick={onReview}
                className="h-8 max-w-[140px] shrink-0 cursor-pointer rounded-[10px] border border-primary bg-primary px-4 py-[7px] text-[12px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary"
            >
                {labels.addReview}
            </button>
        </div>
    );
}

/** Превью фото отзыва: до четырёх, на четвёртом — «+N» (ReviewGallery старого фронта) */
function Thumbs({ images, onOpen }: { images: Image[]; onOpen: (index: number) => void }) {
    if (!images.length) return null;
    return (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
            {images.slice(0, 4).map((image, index) => (
                <button key={image.id} type="button" onClick={() => onOpen(index)} className="relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-[6px] border-0 p-0">
                    {/* eslint-disable-next-line @next/next/no-img-element -- превью из хранилища */}
                    <img src={mediaUrl(image, "small")} alt="" className="block h-full w-full object-cover" />
                    {index === 3 && images.length > 4 && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[14px] font-semibold text-white">{`+${images.length - 4}`}</span>
                    )}
                </button>
            ))}
        </div>
    );
}

const CHEVRON = "M2.59171 18.999L19.6847 1.83759C20.1051 1.41552 20.1051 0.738618 19.6847 0.316551C19.2643 -0.105517 18.5901 -0.105517 18.1697 0.316551L0.315289 18.2425C-0.105096 18.6645 -0.105096 19.3414 0.315289 19.7635L18.1697 37.6815C18.376 37.8885 18.6536 38 18.9233 38C19.1929 38 19.4706 37.8965 19.6768 37.6815C20.0972 37.2594 20.0972 36.5825 19.6768 36.1604L2.59171 18.999Z";

/**
 * Вертикальная лента на три карточки (VerticalSlider старого фронта, Swiper):
 * высота 435 px, сверху и снизу по 45 px под стрелки, между карточками 20 px.
 * Стрелки — при пяти и больше; при четырёх в старом их не было, и четвёртого
 * было не увидеть — здесь они есть всегда, когда есть что листать.
 */
function VerticalSlider({ children, labels }: { children: React.ReactNode[]; labels: { up: string; down: string } }) {
    const [start, setStart] = useState(0);
    const last = Math.max(0, children.length - 3);
    // Высота карточки — треть ленты за вычетом двух промежутков: (345 − 40) / 3
    const slide = (345 - 40) / 3;
    const arrow = (direction: "up" | "down") => {
        const enabled = direction === "up" ? start > 0 : start < last;
        return (
            <button
                type="button"
                aria-label={direction === "up" ? labels.up : labels.down}
                disabled={!enabled}
                onClick={() => setStart((value) => Math.min(last, Math.max(0, value + (direction === "up" ? -1 : 1))))}
                className={`absolute left-[45%] z-10 box-content h-[30px] w-[30px] cursor-pointer border-0 bg-transparent p-2.5 select-none disabled:cursor-default ${direction === "up" ? "top-0 rotate-90" : "bottom-0 rotate-[270deg]"}`}
            >
                <svg aria-hidden width="30" height="30" viewBox="0 0 20 38" preserveAspectRatio="none" className={enabled ? "fill-primary" : "fill-caption"}>
                    <path d={CHEVRON} />
                </svg>
            </button>
        );
    };
    return (
        <div className="mt-5 flex justify-center">
            <div className="relative box-border h-[435px] w-full overflow-hidden py-[45px]">
                <div className="h-full overflow-hidden">
                    <div className="flex flex-col gap-5 transition-transform duration-300" style={{ transform: `translateY(-${start * (slide + 20)}px)` }}>
                        {children.map((child, index) => <div key={index} className="flex shrink-0 justify-center" style={{ height: slide }}>{child}</div>)}
                    </div>
                </div>
                {children.length > 3 && arrow("up")}
                {children.length > 3 && arrow("down")}
            </div>
        </div>
    );
}
