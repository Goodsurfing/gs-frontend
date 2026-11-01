"use client";

import { type DragEvent, useCallback, useEffect, useId, useRef, useState } from "react";

import { Pagination } from "@/components/list/Pagination";
import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import { browserApi } from "@/lib/browserApi";

import { type Application, ApplicationCard, type ApplicationCardLabels, type ApplicationStatus } from "./ApplicationCard";
import { HostReviewDialog, type HostReviewDialogLabels } from "./HostReviewDialog";
import { useApplicationStatus } from "./useApplicationStatus";

const PER_PAGE = 10;
const COLUMNS: ApplicationStatus[] = ["new", "accepted", "canceled"];
/** Подчёркивание шапки колонки (statusColors старого фронта) */
const LINE: Record<ApplicationStatus, string> = { new: "border-status-new", accepted: "border-status-accepted", canceled: "border-status-rejected" };

interface Column { items: Application[]; total: number; page: number }

export interface HostNotesLabels {
    vacancy: string;
    allVacancies: string;
    untitled: string;
    statusError: string;
    reviewTitle: string;
    pages: { prev: string; next: string; page: string };
    card: ApplicationCardLabels;
    dialog: HostReviewDialogLabels;
}

/**
 * «Мои заявки» (NotesHostForm старого фронта): три колонки — новые, принятые,
 * отклонённые, у каждой своя постраничная навигация по 10; фильтр по
 * вакансии. Карточку можно перетащить в другую колонку — статус меняется
 * (так же можно вернуть заявку в «Новые»).
 */
export function HostNotes({ routes, labels }: {
    routes: { volunteer: string; offer: string; chat: string };
    labels: HostNotesLabels;
}) {
    const session = useSession();
    const hostId = (session.profile as { hostId?: string | null } | null)?.hostId ?? null;
    const [vacancies, setVacancies] = useState<{ id: number; title: string }[]>([]);
    const [vacancyId, setVacancyId] = useState<number | undefined>();
    const [columns, setColumns] = useState<Partial<Record<ApplicationStatus, Column>>>({});
    const [review, setReview] = useState<Application | null>(null);
    const [dragOver, setDragOver] = useState<ApplicationStatus | null>(null);
    const selectId = useId();

    // Номер последнего запроса колонки: поздний ответ для прежнего фильтра или страницы не затирает свежий
    const requests = useRef<Partial<Record<ApplicationStatus, number>>>({});
    const loadColumn = useCallback(async (status: ApplicationStatus, page: number, vacancy: number | undefined) => {
        const request = (requests.current[status] ?? 0) + 1;
        requests.current[status] = request;
        const fetchPage = async (target: number) => (await browserApi(session.token).GET("/api/v1/application/list-of-organization", {
            params: { query: { status, limit: String(PER_PAGE), page: String(target), ...(vacancy ? { vacancyId: vacancy } : {}) } },
        }).catch(() => ({ data: undefined }))).data;
        let data = await fetchPage(page);
        // Ушла последняя карточка последней страницы — на предыдущую (иначе колонка пустая и без навигации)
        const pages = Math.max(1, Math.ceil((data?.pagination?.total ?? 0) / PER_PAGE));
        if (page > pages) {
            page = pages;
            data = await fetchPage(page);
        }
        if (requests.current[status] !== request) return;
        setColumns((prev) => ({ ...prev, [status]: { items: data?.data ?? [], total: data?.pagination?.total ?? 0, page } }));
    }, [session.token]);

    const reloadAll = useCallback(() => {
        for (const status of COLUMNS) void loadColumn(status, columns[status]?.page ?? 1, vacancyId);
    }, [loadColumn, columns, vacancyId]);
    const status = useApplicationStatus(reloadAll, labels.statusError);

    useEffect(() => {
        if (session.status !== "user") return;
        // Колонки с первой страницы — при входе и при смене вакансии
        for (const column of COLUMNS) void loadColumn(column, 1, vacancyId);
    }, [session.status, loadColumn, vacancyId]);

    useEffect(() => {
        if (!hostId) return;
        // Вакансии для фильтра: открытые и закрытые, без черновиков; первые 100
        void browserApi(session.token).GET("/api/v1/vacancy/list/{organizationId}", {
            params: { path: { organizationId: hostId }, query: { limit: 100, page: 1, "statuses[]": ["active", "disabled"] } },
        }).then(({ data }) => setVacancies((data?.data ?? []).map((item) => ({ id: item.id, title: item.title })))).catch(() => undefined);
    }, [hostId, session.token]);

    if (COLUMNS.some((column) => !columns[column])) return <Loading className="min-h-[300px] w-full" />;

    const drop = (target: ApplicationStatus) => (event: DragEvent) => {
        event.preventDefault();
        setDragOver(null);
        const [id, from] = event.dataTransfer.getData("text/plain").split(":");
        if (id && from !== target) void status.change(Number(id), target);
    };

    return (
        <div className="flex w-full max-w-[1400px] flex-col items-center gap-10">
            <Toast text={status.error} onClose={status.clearError} />
            <div className="relative flex w-full flex-col justify-center">
                <label htmlFor={selectId} className="text-[0.875rem] text-muted">{labels.vacancy}</label>
                <div className="relative mt-2">
                    <select
                        id={selectId}
                        value={vacancyId ?? ""}
                        onChange={(event) => setVacancyId(event.target.value ? Number(event.target.value) : undefined)}
                        className="box-border h-[50px] w-full min-w-[90px] cursor-pointer appearance-none rounded-[0.625rem] border border-muted bg-white p-3.5 pr-10 text-[1rem] whitespace-nowrap outline-none"
                    >
                        <option value="">{labels.allVacancies}</option>
                        {vacancies.map((vacancy) => <option key={vacancy.id} value={vacancy.id}>{vacancy.title || labels.untitled}</option>)}
                    </select>
                    <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 fill-muted">
                        <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
                    </svg>
                </div>
            </div>
            {/* В старом при 443–756 px колонки minmax(400px) вылезали за край — здесь не шире экрана */}
            <div className="mt-10 grid w-full grid-cols-[repeat(3,1fr)] gap-5 down-756:grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] down-442:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                {COLUMNS.map((column) => {
                    const state = columns[column] ?? { items: [], total: 0, page: 1 };
                    const pages = Math.ceil(state.total / PER_PAGE);
                    return (
                        <section
                            key={column}
                            aria-label={labels.card.statuses[column]}
                            onDragOver={(event) => { event.preventDefault(); setDragOver(column); }}
                            onDragLeave={() => setDragOver(null)}
                            onDrop={drop(column)}
                            className={`h-full min-h-[500px] w-full bg-white shadow-[0_5px_20px_0_rgba(14,29,39,0.05)] ${dragOver === column ? "outline outline-2 outline-primary/40" : ""}`}
                        >
                            <div className={`flex justify-between border-b-2 px-5 py-3.5 ${LINE[column]}`}>
                                <span className="text-[18px] font-medium text-ink-secondary">{labels.card.statuses[column]}</span>
                                <span className="text-[14px] font-medium text-primary">{state.total}</span>
                            </div>
                            <div className="flex h-full w-full flex-col px-3.5">
                                <div className="flex h-full w-full flex-col pb-[30px]">
                                    {state.items.map((application) => (
                                        <div
                                            key={application.id}
                                            draggable
                                            onDragStart={(event) => event.dataTransfer.setData("text/plain", `${application.id}:${column}`)}
                                            className="mt-3.5"
                                        >
                                            <ApplicationCard
                                                application={application}
                                                routes={routes}
                                                onStatus={(next) => void status.change(application.id, next)}
                                                onReview={() => setReview(application)}
                                                labels={labels.card}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {pages > 1 && (
                                    <div className="flex justify-center py-3.5">
                                        <Pagination page={state.page} count={pages} size="small" onPage={(page) => void loadColumn(column, page, vacancyId)} labels={labels.pages} />
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>
            <HostReviewDialog
                volunteer={review && { vacancyId: review.vacancy.id, volunteerId: review.volunteer.id, firstName: review.volunteer.firstName, lastName: review.volunteer.lastName, image: review.volunteer.image, country: review.volunteer.country, city: review.volunteer.city, status: review.status }}
                volunteerHref={review ? routes.volunteer.replace("{id}", review.volunteer.id) : ""}
                title={labels.reviewTitle}
                photos={false}
                onClose={() => setReview(null)}
                // В старом после отзыва «Написать отзыв» оставалась до перезагрузки
                onSent={reloadAll}
                labels={labels.dialog}
            />
        </div>
    );
}
