"use client";

import type { components } from "@goodsurfing/api";
import * as Dialog from "@radix-ui/react-dialog";
import { type ReactNode, useCallback, useEffect, useState } from "react";

import { reachGoal } from "@/components/analytics/YandexMetrika";
import { MemberBanner } from "@/components/content/MemberBanner";
import { OfferShareDialog, type OfferShareLabels } from "@/components/share/OfferShareDialog";
import { Pagination } from "@/components/list/Pagination";
import { useSession } from "@/components/session/SessionProvider";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { textSlice } from "@/lib/textSlice";

type Offer = components["schemas"]["ListByOrganizationResult"];
type Status = "draft" | "active" | "disabled";
interface ListState { items: Offer[]; total: number; page: number }

const PER_PAGE = 10;
/** Ответ бэкенда, когда без членства публикуют вторую вакансию (VACANCY_LIMIT_EXCEEDED_DETAIL старого фронта) */
const LIMIT_DETAIL = "Free account allows up to 1 published vacancy. Get a membership to publish without limits.";

export interface HostOffersLabels {
    title: string;
    drafts: string;
    empty: string;
    add: string;
    edit: string;
    close: string;
    open: string;
    remove: string;
    reviews: string;
    went: string;
    confirmToggle: string;
    confirmDelete: string;
    ok: string;
    cancel: string;
    cantDelete: string;
    createError: string;
    limitTitle: string;
    limitButton: string;
    closeWindow: string;
    pages: { prev: string; next: string; page: string };
    categories: Record<string, string>;
    share: string;
    shareDialog: OfferShareLabels;
    /** Подзаголовок окна сразу после публикации */
    sharePublished: string;
}

/**
 * «Мои вакансии» (HostOffersPage старого фронта): открытые и закрытые
 * вакансии, ниже — черновики, у каждого списка своя пагинация по 10.
 * Мастер вакансии остаётся в старом SPA — переходы в него полной загрузкой.
 */
export function HostOffers({ locale, routes, aside, labels }: {
    locale: Locale;
    /** Адреса с {id}: публичная вакансия, мастер с «Где», приветствие мастера */
    routes: { offer: string; edit: string; welcome: string };
    aside: ReactNode;
    labels: HostOffersLabels;
}) {
    const session = useSession();
    const profile = session.profile as { hostId?: string | null; isActive?: boolean } | null;
    const hostId = profile?.hostId ?? null;
    const [open, setOpen] = useState<ListState | null>(null);
    const [drafts, setDrafts] = useState<ListState | null>(null);
    const [confirm, setConfirm] = useState<{ offer: Offer; action: "toggle" | "delete" } | null>(null);
    const [busy, setBusy] = useState(false);
    const [creating, setCreating] = useState(false);
    const [limit, setLimit] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const closeToast = useCallback(() => setToast(null), []);
    // «Поделиться»: id вакансии и откуда открыли (после публикации — свой подзаголовок)
    const [share, setShare] = useState<{ id: string; published: boolean } | null>(null);
    useEffect(() => {
        const published = new URLSearchParams(window.location.search).get("published");
        if (!published || !/^\d+$/.test(published)) return;
        // Адрес известен только в браузере — окно открывается после гидратации
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShare({ id: published, published: true });
        // Убрать параметр, чтобы окно не открывалось снова при обновлении страницы
        const url = new URL(window.location.href);
        url.searchParams.delete("published");
        window.history.replaceState(null, "", url.toString());
    }, []);

    const load = useCallback(async (statuses: Status[], page: number): Promise<ListState> => {
        if (!hostId) return { items: [], total: 0, page };
        const fetchPage = async (target: number) => (await browserApi(session.token).GET("/api/v1/vacancy/list/{organizationId}", {
            params: { path: { organizationId: hostId }, query: { limit: PER_PAGE, page: target, "statuses[]": statuses } },
        }).catch(() => ({ data: undefined }))).data;
        let data = await fetchPage(page);
        // Удалили последнюю карточку на последней странице — на предыдущую (в старом список оставался пустым)
        const pages = Math.max(1, Math.ceil((data?.pagination?.total ?? 0) / PER_PAGE));
        if (page > pages) {
            page = pages;
            data = await fetchPage(page);
        }
        return { items: data?.data ?? [], total: data?.pagination?.total ?? 0, page };
    }, [hostId, session.token]);

    const reload = useCallback(async (openPage: number, draftPage: number) => {
        const [nextOpen, nextDrafts] = await Promise.all([load(["active", "disabled"], openPage), load(["draft"], draftPage)]);
        setOpen(nextOpen);
        setDrafts(nextDrafts);
    }, [load]);

    useEffect(() => {
        // Списки — после того, как сессия узнала организацию
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (hostId) void reload(1, 1);
    }, [hostId, reload]);

    if (!open || !drafts) return <Loading className="min-h-[300px]" />;

    const status = (offer: Offer) => String(offer.status) as Status;
    const act = async () => {
        if (!confirm || busy) return;
        const { offer, action } = confirm;
        const api = browserApi(session.token);
        setBusy(true);
        if (action === "delete") {
            const { error } = await api.DELETE("/api/v1/vacancy/{id}", { params: { path: { id: offer.id } } }).catch(() => ({ error: true }));
            if (error) setToast(labels.cantDelete);
        } else {
            // Статус перепроверяется перед переключением, как в старом
            const { data } = await api.GET("/api/v1/vacancy/{id}", { params: { path: { id: offer.id } } }).catch(() => ({ data: undefined }));
            const current = String(data?.status ?? status(offer));
            if (current === "active" || current === "disabled") {
                const next = current === "active" ? "disabled" : "active";
                const { error } = await api.PATCH("/api/v1/vacancy/{id}/toggle-status", { params: { path: { id: offer.id } }, body: { status: next } }).catch((reason: unknown) => ({ error: reason }));
                if (!error && next === "active") reachGoal("vacancy_published", { from: "list" });
                if (error && (error as { detail?: unknown }).detail === LIMIT_DETAIL) setLimit(true);
            }
        }
        setBusy(false);
        setConfirm(null);
        await reload(open.page, drafts.page);
    };

    const create = async () => {
        setCreating(true);
        const { data, error } = await browserApi(session.token).POST("/api/v1/vacancies", { body: {} as never }).catch(() => ({ data: undefined, error: true }));
        const id = (data as { id?: number | string } | undefined)?.id;
        if (error || !id) {
            setCreating(false);
            setToast(labels.createError);
            return;
        }
        window.location.assign(routes.welcome.replace("{id}", String(id)));
    };

    const list = (state: ListState) => (
        <div className="mt-10 flex w-full flex-wrap gap-5">
            {state.items.length === 0 && <span>{labels.empty}</span>}
            {state.items.map((offer) => (
                <HostOfferCard
                    key={offer.id}
                    offer={offer}
                    href={routes.offer.replace("{id}", String(offer.id))}
                    onEdit={() => window.location.assign((status(offer) === "draft" ? routes.welcome : routes.edit).replace("{id}", String(offer.id)))}
                    onToggle={() => setConfirm({ offer, action: "toggle" })}
                    onDelete={() => setConfirm({ offer, action: "delete" })}
                    onShare={status(offer) === "active" ? () => setShare({ id: String(offer.id), published: false }) : undefined}
                    labels={labels}
                />
            ))}
        </div>
    );
    const pages = (state: ListState, onPage: (page: number) => void) => (state.total > PER_PAGE
        ? <Pagination page={state.page} count={Math.ceil(state.total / PER_PAGE)} onPage={onPage} labels={labels.pages} />
        : null);

    return (
        <>
            <Toast text={toast} onClose={closeToast} />
            <h2 className="text-[1.625rem] leading-8 font-normal">{labels.title}</h2>
            <div className="flex items-start gap-8 down-1200:flex-col-reverse down-1200:gap-0">
                <div className="max-w-[900px] min-w-0 flex-1 down-1200:max-w-none">
                    {list(open)}
                    {pages(open, (page) => void load(["active", "disabled"], page).then(setOpen))}
                    {/* В старом блок был виден и при ошибке запроса — здесь только когда черновики есть */}
                    {drafts.total > 0 && (
                        <div>
                            <h2 className="mt-10 text-[1.625rem] leading-8 font-normal">{labels.drafts}</h2>
                            <div className="flex flex-wrap gap-5">{list(drafts)}</div>
                            {pages(drafts, (page) => void load(["draft"], page).then(setDrafts))}
                        </div>
                    )}
                </div>
                {/* Баннер держится под шапкой при прокрутке: низ шапки кабинета (126 px) + 16 */}
                <div className="sticky top-[142px] mt-10 shrink-0 down-1200:static down-1200:mt-6">{aside}</div>
            </div>
            <div className="mt-[50px]">
                <button
                    type="button"
                    disabled={creating || !hostId || profile?.isActive === false}
                    onClick={() => void create()}
                    className="flex cursor-pointer items-center justify-center rounded-[10px] border border-primary bg-primary px-[100px] py-3 text-label text-white transition-all duration-300 hover:bg-white hover:text-primary disabled:cursor-default disabled:opacity-70 down-lg:w-full down-sm:p-3"
                >
                    {labels.add}
                </button>
            </div>
            <ConfirmDialog
                open={!!confirm}
                size="medium"
                text={confirm?.action === "delete" ? labels.confirmDelete : labels.confirmToggle}
                confirm={labels.ok}
                cancel={labels.cancel}
                busy={busy}
                onConfirm={() => void act()}
                onClose={() => setConfirm(null)}
            />
            {share && (
                <OfferShareDialog
                    open
                    onOpenChange={(next) => !next && setShare(null)}
                    offerId={share.id}
                    offerUrl={`${window.location.origin}${routes.offer.replace("{id}", share.id)}`}
                    cardUrl={`${routes.offer.replace("{id}", share.id)}/card`}
                    source="host"
                    locale={locale}
                    labels={{ ...labels.shareDialog, intro: share.published ? labels.sharePublished : labels.shareDialog.intro }}
                />
            )}
            <Dialog.Root open={limit} onOpenChange={setLimit}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in justify-center overflow-y-auto bg-black/50 py-10">
                        <Dialog.Content aria-describedby={undefined} className="relative w-[468px] max-w-full self-center outline-none">
                            <Dialog.Title className="sr-only">{labels.limitTitle}</Dialog.Title>
                            <Dialog.Close aria-label={labels.closeWindow} className="absolute top-0 -right-10 cursor-pointer text-white down-md:top-[-12%] down-md:right-[5%]">
                                <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="block">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" />
                                </svg>
                            </Dialog.Close>
                            <MemberBanner locale={locale} title={labels.limitTitle} button={labels.limitButton} anchor="host" />
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}

const button = "cursor-pointer rounded-[10px] border text-[1rem] transition-all duration-300";

/** Карточка вакансии в кабинете (HostOffersPageCard старого фронта) */
function HostOfferCard({ offer, href, onEdit, onToggle, onDelete, onShare, labels }: {
    offer: Offer;
    href: string;
    onEdit: () => void;
    onToggle: () => void;
    onDelete: () => void;
    /** Только у открытых вакансий */
    onShare?: () => void;
    labels: HostOffersLabels;
}) {
    const status = String(offer.status);
    const category = offer.categories?.[0]?.trim();
    const rating = offer.averageRating === null || offer.averageRating === undefined ? "" : String(Number(offer.averageRating));
    return (
        <div className="box-border flex w-full max-w-[900px] items-center justify-between gap-3.5 bg-white p-5 shadow-[0_5px_20px_0_#2121210d] transition-all duration-300 hover:shadow-[0_5px_20px_0_rgb(33_33_33/15%)] down-1200:flex-wrap">
            <a href={href} className="flex text-inherit no-underline down-sm:flex-wrap">
                <div className="h-[140px] w-[180px] down-sm:h-[180px] down-sm:w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element -- обложка вакансии */}
                    <img loading="lazy" decoding="async" src={mediaUrl(offer.image, "medium") ?? "/web/images/default-offer.png"} alt="travel-img" className="h-full w-full object-cover" />
                </div>
                <div className="ml-3.5 down-sm:mt-[15px] down-sm:ml-0">
                    <p className="text-[1.125rem] leading-[22px] font-medium text-ink-secondary">{textSlice(offer.title, 34, "Без заголовка")}</p>
                    <div className="mt-3 text-[14px] leading-5 font-medium text-caption down-sm:flex down-sm:flex-col down-sm:gap-[5px]">
                        <span>{textSlice(offer.address, 34, "Без адреса")}</span>
                        <span className="ml-6 down-sm:ml-0">{category ? labels.categories[category] ?? category : ""}</span>
                    </div>
                    <div className="mt-3 flex gap-x-6 gap-y-1 down-sm:flex-wrap">
                        {rating && (
                            <div className="flex items-center">
                                {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                <img src="/web/icons/offer/star.svg" alt="" className="h-[13px] w-[13px]" />
                                <span className="ml-1.5 text-[14px] leading-5 font-bold">{rating}</span>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-3 text-[14px] leading-5 font-medium">
                            {offer.reviewsCount !== null && offer.reviewsCount !== undefined && <span>{labels.reviews} {offer.reviewsCount}</span>}
                            <span>{labels.went} {offer.acceptedApplicationsCount}</span>
                        </div>
                    </div>
                    <p className="mt-3 max-w-[300px] text-[14px] leading-[17px] font-medium text-caption">{textSlice(offer.shortDescription, 110, "Без описания")}</p>
                </div>
            </a>
            <div className="flex flex-col gap-2 down-1200:grid down-1200:w-full down-1200:grid-cols-3 down-md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] down-sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                <button type="button" onClick={onEdit} className={`${button} border-cta bg-cta px-5 py-2.5 leading-4 text-white hover:bg-white hover:text-cta`}>{labels.edit}</button>
                {/* У черновика «Закрыть» в старом ничего не делала — здесь неактивна */}
                <button
                    type="button"
                    onClick={onToggle}
                    disabled={status === "draft"}
                    className={`${button} px-5 py-2.5 leading-4 disabled:cursor-default disabled:opacity-70 ${status === "disabled" ? "border-ink text-ink hover:bg-ink hover:text-white" : "border-caption text-caption hover:bg-caption hover:text-white disabled:hover:bg-transparent disabled:hover:text-caption"}`}
                >
                    {status === "disabled" ? labels.open : labels.close}
                </button>
                {onShare && <button type="button" onClick={onShare} className={`${button} border-primary bg-primary px-5 py-2.5 leading-4 text-white hover:bg-white hover:text-primary`}>{labels.share}</button>}
                <button type="button" onClick={onDelete} className={`${button} border-error bg-error px-[50px] py-2.5 leading-[120%] text-white hover:bg-white hover:text-error`}>{labels.remove}</button>
            </div>
        </div>
    );
}
