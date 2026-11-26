"use client";

import { useEffect, useId, useRef, useState } from "react";

import { ApplicationsEmpty, ApplicationsError, ApplicationsLoading } from "@/components/cabinet/applications/ApplicationsListStates";
import { ApplicationsSearch } from "@/components/cabinet/applications/ApplicationsSearch";
import { CountTabs } from "@/components/cabinet/applications/CountTabs";
import { type LoadApplicationCounts, type LoadApplications, useApplicationsView } from "@/components/cabinet/applications/useApplicationsView";
import { Pagination } from "@/components/list/Pagination";
import { useSession } from "@/components/session/SessionProvider";
import { Toast } from "@/components/ui/Toast";
import { browserApi } from "@/lib/browserApi";
import { APPLICATION_TABS, type ApplicationTab, applicationsListQuery, type PluralText } from "@/lib/applicationsView";

import { type Application, ApplicationCard, type ApplicationCardLabels } from "./ApplicationCard";
import { HostReviewDialog, type HostReviewDialogLabels } from "./HostReviewDialog";
import { NewApplicationsBanner } from "./NewApplicationsBanner";
import { useApplicationStatus } from "./useApplicationStatus";

export interface HostNotesLabels {
    search: string;
    searchPlaceholder: string;
    clearSearch: string;
    vacancy: string;
    allVacancies: string;
    untitled: string;
    tabs: Record<ApplicationTab, string>;
    waiting: PluralText;
    reply: string;
    loadError: string;
    retry: string;
    empty: string;
    emptyFiltered: string;
    resetFilters: string;
    statusError: string;
    reviewTitle: string;
    pages: { prev: string; next: string; page: string };
    card: ApplicationCardLabels;
    dialog: HostReviewDialogLabels;
}

const loadList: LoadApplications<Application> = async (token, filter) => {
    const { data, error } = await browserApi(token).GET("/api/v1/application/list-of-organization", { params: { query: applicationsListQuery(filter) } });
    return error || !data ? null : { items: data.data ?? [], total: data.pagination?.total ?? 0 };
};

const loadCounts: LoadApplicationCounts = async (token, { vacancyId, search }) => {
    const { data } = await browserApi(token).GET("/api/v1/application/list-of-organization/counts", {
        params: { query: { ...(vacancyId ? { vacancyId } : {}), ...(search.trim() ? { search: search.trim() } : {}) } },
    });
    return data ? { new: data.new, accepted: data.accepted, canceled: data.canceled, all: data.all } : null;
};

/**
 * «Заявки» организатора (GS-331, раздел 4.10): поиск по имени волонтёра,
 * выбор вакансии, вкладки «Новые / Приняты / Отклонены / Все» с числами
 * с сервера, карточки с текстом отклика и постраничная навигация. Фильтры —
 * в адресе (?status=&q=&vacancy=&page=): ссылка с рабочего стола и «Назад»
 * из переписки возвращают туда же.
 */
export function HostNotes({ locale, routes, labels }: {
    locale: string;
    routes: { volunteer: string; offer: string; chat: string };
    labels: HostNotesLabels;
}) {
    const session = useSession();
    const hostId = (session.profile as { hostId?: string | null } | null)?.hostId ?? null;
    const view = useApplicationsView({ defaultTab: "new", loadList, loadCounts, emptyTabFallback: true });
    const { filter, list, counts, update } = view;
    const [vacancies, setVacancies] = useState<{ id: number; title: string }[]>([]);
    const [review, setReview] = useState<Application | null>(null);
    const selectId = useId();
    const tabsId = useId();
    const listTop = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!hostId) return;
        // Вакансии для фильтра: открытые и закрытые, без черновиков; первые 100
        void browserApi(session.token).GET("/api/v1/vacancy/list/{organizationId}", {
            params: { path: { organizationId: hostId }, query: { limit: 100, page: 1, "statuses[]": ["active", "disabled"] } },
        }).then(({ data }) => setVacancies((data?.data ?? []).map((item) => ({ id: item.id, title: item.title })))).catch(() => undefined);
    }, [hostId, session.token]);

    const reload = view.reload;
    const status = useApplicationStatus(reload, labels.statusError);
    const goToPage = (page: number) => {
        update({ page });
        listTop.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    };

    return (
        <div className="flex w-full max-w-[1100px] flex-col gap-5">
            <Toast text={status.error} onClose={status.clearError} />
            {filter && filter.tab !== "new" && (
                <NewApplicationsBanner locale={locale} count={counts?.new ?? 0} forms={labels.waiting} action={labels.reply} onAction={() => update({ tab: "new" })} />
            )}
            <div className="flex gap-3 down-md:flex-col">
                <ApplicationsSearch
                    value={view.searchText}
                    label={labels.search}
                    placeholder={labels.searchPlaceholder}
                    clearLabel={labels.clearSearch}
                    onChange={view.setSearchText}
                    onSubmit={() => update({ search: view.searchText })}
                    onClear={() => view.resetSearch()}
                />
                <div className="relative w-[320px] down-md:w-full">
                    <label htmlFor={selectId} className="sr-only">{labels.vacancy}</label>
                    <select
                        id={selectId}
                        value={filter?.vacancyId ?? ""}
                        onChange={(event) => update({ vacancyId: event.target.value ? Number(event.target.value) : undefined })}
                        className="box-border h-[50px] w-full cursor-pointer appearance-none truncate rounded-[0.625rem] border border-muted bg-white p-3.5 pr-10 text-[1rem] outline-none focus:border-primary"
                    >
                        <option value="">{labels.allVacancies}</option>
                        {vacancies.map((vacancy) => <option key={vacancy.id} value={vacancy.id}>{vacancy.title || labels.untitled}</option>)}
                    </select>
                    <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 fill-muted">
                        <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
                    </svg>
                </div>
            </div>
            <CountTabs ref={listTop} id={tabsId} tabs={APPLICATION_TABS} selected={filter?.tab} counts={counts} labels={labels.tabs} label={labels.vacancy} onSelect={(tab: ApplicationTab) => update({ tab })} />
            <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={filter ? `${tabsId}-${filter.tab}` : undefined} aria-busy={list.state === "loading"}>
                {list.state === "loading" && <ApplicationsLoading />}
                {list.state === "error" && <ApplicationsError text={labels.loadError} retry={labels.retry} onRetry={reload} />}
                {list.state === "ready" && list.items.length === 0 && (
                    <ApplicationsEmpty
                        text={view.filtered ? labels.emptyFiltered : labels.empty}
                        reset={view.narrowed ? { label: labels.resetFilters, onClick: () => view.resetSearch({ vacancyId: undefined }) } : undefined}
                    />
                )}
                {list.state === "ready" && list.items.length > 0 && (
                    <div className="grid grid-cols-2 items-start gap-4 down-lg:grid-cols-1">
                        {list.items.map((application) => (
                            <ApplicationCard
                                key={application.id}
                                application={application}
                                routes={routes}
                                onStatus={(next) => status.change(application.id, next)}
                                onReview={() => setReview(application)}
                                labels={labels.card}
                            />
                        ))}
                    </div>
                )}
                {view.pages > 1 && filter && (
                    <div className="flex justify-center py-5">
                        <Pagination page={filter.page} count={view.pages} onPage={goToPage} labels={labels.pages} />
                    </div>
                )}
            </div>
            <HostReviewDialog
                volunteer={review && { vacancyId: review.vacancy.id, volunteerId: review.volunteer.id, firstName: review.volunteer.firstName, lastName: review.volunteer.lastName, image: review.volunteer.image, country: review.volunteer.country, city: review.volunteer.city, status: review.status }}
                volunteerHref={review ? routes.volunteer.replace("{id}", review.volunteer.id) : ""}
                title={labels.reviewTitle}
                photos={false}
                onClose={() => setReview(null)}
                onSent={reload}
                labels={labels.dialog}
            />
        </div>
    );
}
