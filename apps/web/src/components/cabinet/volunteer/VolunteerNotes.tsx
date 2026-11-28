"use client";

import { useId, useRef, useState } from "react";

import { ApplicationsEmpty, ApplicationsError, ApplicationsLoading } from "@/components/cabinet/applications/ApplicationsListStates";
import { ApplicationsSearch } from "@/components/cabinet/applications/ApplicationsSearch";
import { CountTabs } from "@/components/cabinet/applications/CountTabs";
import { type LoadApplicationCounts, type LoadApplications, useApplicationsView } from "@/components/cabinet/applications/useApplicationsView";
import { Pagination } from "@/components/list/Pagination";
import { useSession } from "@/components/session/SessionProvider";
import { OfferShareDialog, type OfferShareLabels } from "@/components/share/OfferShareDialog";
import { Avatar } from "@/components/ui/Avatar";
import type { Locale } from "@/i18n/config";
import { applicationsListQuery, type ApplicationTab, VOLUNTEER_APPLICATION_TABS } from "@/lib/applicationsView";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { applicationHref, applicationStatus, type VolunteerApplication } from "@/lib/volunteerApplications";

import { ApplicationSummary, type ApplicationSummaryLabels } from "./ApplicationSummary";
import { OfferReviewDialog, type OfferReviewDialogLabels } from "./OfferReviewDialog";

export interface VolunteerNotesLabels {
    search: string;
    searchPlaceholder: string;
    clearSearch: string;
    tabsLabel: string;
    tabs: Record<ApplicationTab, string>;
    card: ApplicationSummaryLabels;
    openOffer: string;
    review: string;
    share: string;
    loadError: string;
    retry: string;
    empty: string;
    emptyHint: string;
    find: string;
    emptySearch: string;
    emptyTab: string;
    resetSearch: string;
    sendError: string;
    pagination: { prev: string; next: string; page: string };
    dialog: OfferReviewDialogLabels;
    shareDialog: OfferShareLabels;
}

const loadList: LoadApplications<VolunteerApplication> = async (token, filter) => {
    const { data, error } = await browserApi(token).GET("/api/v1/application/list-of-volunteer", { params: { query: applicationsListQuery(filter) } });
    return error || !data ? null : { items: data.data ?? [], total: data.pagination?.total ?? 0 };
};

const loadCounts: LoadApplicationCounts = async (token, { search }) => {
    const query = search.trim();
    const { data } = await browserApi(token).GET("/api/v1/application/list-of-volunteer/counts", { params: { query: query ? { search: query } : {} } });
    return data ? { new: data.new, accepted: data.accepted, canceled: data.canceled, all: data.all } : null;
};

const secondaryButton = "flex min-h-10 cursor-pointer items-center justify-center rounded-[10px] border border-primary bg-white px-4 text-[14px] text-primary no-underline transition-colors hover:bg-primary hover:text-white";

/**
 * «Мои заявки» волонтёра (GS-332, раздел 4.7): поиск по вакансии и
 * организатору, вкладки «Все / На рассмотрении / Приняты / Отклонены» с
 * числами с сервера, карточки с фото, организатором, датами, статусом и тем,
 * что дальше; нажатие на карточку открывает переписку. Поиск, вкладки и
 * состояния — общие с «Заявками» организатора (GS-331).
 */
export function VolunteerNotes({ locale, hrefs, labels }: {
    locale: Locale;
    hrefs: { offer: string; chat: string; catalog: string };
    labels: VolunteerNotesLabels;
}) {
    const session = useSession();
    const view = useApplicationsView({ defaultTab: "all", loadList, loadCounts });
    const { filter, list, counts, update } = view;
    const tabsId = useId();
    const listTop = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState<VolunteerApplication | null>(null);

    // «Поделиться» принятой заявкой: ссылка на вакансию со своим кодом «Пригласи друга» (GS-265)
    const [shareId, setShareId] = useState<string | null>(null);
    const [refCode, setRefCode] = useState<string | null>(null);
    const openShare = (id: string) => {
        setShareId(id);
        if (refCode) return;
        void browserApi(session.token).GET("/api/v1/referral")
            .then(({ data: referral }) => setRefCode((referral as { code?: string } | undefined)?.code ?? null))
            .catch(() => undefined);
    };

    const goToPage = (page: number) => {
        update({ page });
        listTop.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    // Нет ни одной заявки вообще — «Пока нет заявок» и «Найти поездку»
    const none = list.state === "ready" && list.items.length === 0 && !view.narrowed && (filter?.tab === "all" || counts?.all === 0);

    return (
        <div className="mt-6 flex w-full max-w-[1100px] flex-col gap-5">
            <ApplicationsSearch
                value={view.searchText}
                label={labels.search}
                placeholder={labels.searchPlaceholder}
                clearLabel={labels.clearSearch}
                onChange={view.setSearchText}
                onSubmit={() => update({ search: view.searchText })}
                onClear={() => view.resetSearch()}
            />
            <CountTabs ref={listTop} id={tabsId} tabs={VOLUNTEER_APPLICATION_TABS} selected={filter?.tab} counts={counts} labels={labels.tabs} label={labels.tabsLabel} onSelect={(tab) => update({ tab })} />
            <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={filter ? `${tabsId}-${filter.tab}` : undefined} aria-busy={list.state === "loading"}>
                {list.state === "loading" && <ApplicationsLoading height={150} />}
                {list.state === "error" && <ApplicationsError text={labels.loadError} retry={labels.retry} onRetry={view.reload} />}
                {list.state === "ready" && list.items.length === 0 && (
                    none ? (
                        <ApplicationsEmpty text={labels.empty}>
                            <p className="m-0 max-w-[360px] text-[14px] leading-[140%] text-caption">{labels.emptyHint}</p>
                            <a href={hrefs.catalog} className="mt-1 inline-flex h-12 items-center justify-center rounded-[10px] bg-cta px-6 text-[16px] font-semibold text-white no-underline hover:bg-cta-hover">{labels.find}</a>
                        </ApplicationsEmpty>
                    ) : (
                        <ApplicationsEmpty
                            text={view.narrowed ? labels.emptySearch : labels.emptyTab}
                            reset={view.narrowed ? { label: labels.resetSearch, onClick: () => view.resetSearch() } : undefined}
                        />
                    )
                )}
                {list.state === "ready" && list.items.length > 0 && (
                    <ul className="m-0 grid list-none grid-cols-2 items-start gap-4 p-0 down-lg:grid-cols-1">
                        {list.items.map((application, index) => {
                            const accepted = applicationStatus(application.status) === "accepted";
                            return (
                                <li key={application.id} data-testid="application-card" className="flex flex-col gap-3 rounded-[12px] border border-accent-bg bg-white p-3.5">
                                    {/* Вся карточка — в переписку (нет переписки — на вакансию) */}
                                    <a href={applicationHref(application, hrefs)} className="flex gap-3 text-inherit no-underline hover:[&_h3]:text-primary">
                                        <ApplicationSummary item={application} labels={labels.card} thumb={72} lazy={index > 3} organizer titleTag="h3" />
                                    </a>
                                    <div className="flex flex-wrap gap-2">
                                        <a href={hrefs.offer.replace("{id}", String(application.vacancy.id))} className={secondaryButton}>{labels.openOffer}</a>
                                        {accepted && <button type="button" onClick={() => openShare(String(application.vacancy.id))} className={secondaryButton}>{labels.share}</button>}
                                        {accepted && !application.isHasReview && (
                                            <button type="button" onClick={() => setSelected(application)} className={secondaryButton}>{labels.review}</button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
                {view.pages > 1 && filter && (
                    <div className="flex justify-center py-5">
                        <Pagination page={filter.page} count={view.pages} onPage={goToPage} labels={labels.pagination} />
                    </div>
                )}
            </div>
            {shareId && (
                <OfferShareDialog
                    open
                    onOpenChange={(next) => !next && setShareId(null)}
                    offerId={shareId}
                    offerUrl={`${window.location.origin}${hrefs.offer.replace("{id}", shareId)}${refCode ? `?ref=${encodeURIComponent(refCode)}` : ""}`}
                    cardUrl={`${hrefs.offer.replace("{id}", shareId)}/card`}
                    source="volunteer"
                    locale={locale}
                    labels={labels.shareDialog}
                />
            )}
            <OfferReviewDialog
                open={!!selected}
                labels={labels.dialog}
                assistant={selected ? { token: session.token, vacancyId: selected.vacancy.id } : undefined}
                onClose={() => setSelected(null)}
                offer={selected && (
                    <div className="flex w-full gap-2 border border-accent-bg bg-white p-3.5 select-none">
                        <Avatar src={mediaUrl(selected.vacancy.image, "small")} name={selected.vacancy.title} size={56} />
                        <span className="text-[14px] font-medium text-ink">{selected.vacancy.title?.trim() || labels.card.noTitle}</span>
                    </div>
                )}
                onSend={async ({ rating, text }) => {
                    if (!selected) return labels.sendError;
                    const { error, response } = await browserApi(session.token).POST("/api/v1/review-vacancy", {
                        body: { vacancyId: selected.vacancy.id, rating: rating as never, description: text, imageIds: [] },
                    }).catch(() => ({ error: true, response: undefined }));
                    // Текст ошибки бэкенда (getErrorText старого фронта), иначе общий. Ошибка
                    // с пустым телом приходит без error — поэтому ещё и response.ok
                    if (error || !response?.ok) {
                        const { detail, message } = (typeof error === "object" ? error : {}) as { detail?: unknown; message?: unknown };
                        return typeof detail === "string" ? detail : typeof message === "string" ? message : labels.sendError;
                    }
                    view.reload();
                    return null;
                }}
            />
        </div>
    );
}
