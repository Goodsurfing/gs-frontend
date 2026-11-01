"use client";

import { useCallback, useEffect, useState } from "react";

import { MemberBanner } from "@/components/content/MemberBanner";
import { useSession } from "@/components/session/SessionProvider";
import { Ring } from "@/components/ui/Ring";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";
import { hasHostMembership } from "@/lib/occupancy";

import { type Application, ApplicationCard, type ApplicationCardLabels } from "./ApplicationCard";
import { HostReviewDialog, type HostReviewDialogLabels } from "./HostReviewDialog";
import { useApplicationStatus } from "./useApplicationStatus";
import { useMyOrganization } from "./useMyOrganization";

/** Без членства можно опубликовать одну вакансию (FREE_VACANCIES_LIMIT, VacancyConstant::FREE_VACANCY_LIMIT на бэкенде) */
const FREE_VACANCIES_LIMIT = 1;
const NOTIFICATION_DATE_KEY = "firstNotificationDate";

export interface HostDashboardLabels {
    fillTitle: string;
    points: { description: string; vacancies: string; photo: string; video: string; reviews: string };
    editProfile: string;
    quota: { left: string; leftHint: string; unlimited: string; unlimitedHint: string };
    requests: string;
    newRequests: string;
    loading: string;
    empty: string;
    showAll: string;
    statusError: string;
    memberTitle: string;
    memberButton: string;
    notifications: string;
    welcome: string;
    welcomeText: string;
    reviewTitle: string;
    card: ApplicationCardLabels;
    dialog: HostReviewDialogLabels;
}

/**
 * Рабочий стол организатора (HostDashboardPage старого фронта):
 * заполненность профиля и счётчик вакансий, последние 10 заявок,
 * баннер членства (только без членства) и уведомления.
 */
export function HostDashboard({ locale, routes, labels }: {
    locale: Locale;
    routes: { info: string; notes: string; membership: string; volunteer: string; offer: string; chat: string };
    labels: HostDashboardLabels;
}) {
    const session = useSession();
    const { organization } = useMyOrganization();
    const [hasReviews, setHasReviews] = useState(false);
    const [occupancy, setOccupancy] = useState<{ member: boolean; remaining: number } | null>(null);
    const [applications, setApplications] = useState<Application[] | null>(null);
    const [newCount, setNewCount] = useState(0);
    const [review, setReview] = useState<Application | null>(null);
    const [notificationDate, setNotificationDate] = useState("");

    const loadApplications = useCallback(async () => {
        const api = browserApi(session.token);
        const [list, fresh] = await Promise.all([
            api.GET("/api/v1/application/list-of-organization", { params: { query: { limit: "10", page: "1" } } }).catch(() => ({ data: undefined })),
            api.GET("/api/v1/application/list-of-organization", { params: { query: { status: "new", limit: "1", page: "1" } } }).catch(() => ({ data: undefined })),
        ]);
        setApplications(list.data?.data ?? []);
        setNewCount(fresh.data?.pagination?.total ?? 0);
    }, [session.token]);
    const status = useApplicationStatus(() => void loadApplications(), labels.statusError);

    useEffect(() => {
        if (session.status !== "user") return;
        const api = browserApi(session.token);
        // Списки и членство — после того, как сессия узнала вошедшего
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadApplications();
        void api.GET("/api/v1/review-vacancy", { params: { query: { limit: 1, page: 1 } } })
            .then(({ data }) => setHasReviews((data?.data?.length ?? 0) > 0)).catch(() => undefined);
        void api.GET("/api/v1/profile/occupancy").then(({ data }) => {
            if (data) setOccupancy({ member: hasHostMembership(data), remaining: data.remainingFreeVacancies ?? 0 });
        }).catch(() => undefined);
    }, [session.status, session.token, loadApplications]);

    useEffect(() => {
        // Дата первого уведомления — общая со старым SPA запись в localStorage (формат toDateString)
        let date = "";
        try {
            date = window.localStorage.getItem(NOTIFICATION_DATE_KEY) ?? "";
            if (!date) {
                date = new Date().toDateString();
                window.localStorage.setItem(NOTIFICATION_DATE_KEY, date);
            }
        } catch {
            date = new Date().toDateString();
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNotificationDate(date);
    }, []);

    const points = [
        { text: labels.points.description, done: !!organization?.name },
        { text: labels.points.vacancies, done: (organization?.vacancies?.length ?? 0) > 0 },
        { text: labels.points.photo, done: (organization?.galleryImages?.length ?? 0) > 0 },
        { text: labels.points.video, done: (organization?.videoGallery?.length ?? 0) > 0 },
        { text: labels.points.reviews, done: hasReviews },
    ];
    const percent = (100 / points.length) * points.filter((point) => point.done).length;
    const remaining = Math.max(0, Math.min(FREE_VACANCIES_LIMIT, occupancy?.remaining ?? 0));
    const panel = "w-full max-w-[486px] bg-white shadow-[0_5px_20px_rgba(14,29,39,0.05)] down-lg:max-w-none";
    const panelTitle = "flex items-center justify-between border-b-2 border-accent-bg bg-white px-5 py-3.5";

    return (
        <div className="w-full max-w-[1400px] pr-[50px] down-lg:pr-0">
            <Toast text={status.error} onClose={status.clearError} />
            <div className="flex w-full flex-col bg-white drop-shadow-[0_5px_20px_rgba(14,29,39,0.05)]">
                <div className="flex border-b border-caption px-5 py-[13px]">
                    {/* В старом стиль заголовка не применялся (опечатка в классе) — браузерный h3 */}
                    <h3 className="text-[1.17em] font-bold">{organization?.name || labels.fillTitle}</h3>
                </div>
                <div className="flex items-center justify-between px-6 py-4 down-md:flex-col-reverse">
                    <div className="mt-[18px] flex flex-col gap-[38px]">
                        <ul className="flex flex-wrap gap-[30px]">
                            {points.map((point) => (
                                <li key={point.text} className="flex items-center">
                                    <div className={`mb-0.5 h-3 w-3 rounded-full ${point.done ? "bg-cta" : "bg-caption"}`} />
                                    <span className="ml-2.5 text-ink">{point.text}</span>
                                </li>
                            ))}
                        </ul>
                        <div>
                            <a href={routes.info} className="inline-flex items-center justify-center rounded-[10px] border border-cta bg-cta px-[50px] py-2.5 text-label text-white no-underline transition-all duration-300 hover:bg-white hover:text-cta down-md:w-full down-md:p-2.5">
                                {labels.editProfile}
                            </a>
                        </div>
                    </div>
                    <div className="mr-auto ml-[130px] flex items-start gap-8 down-md:mx-0 down-sm:flex-col down-sm:items-center down-sm:gap-5">
                        <Ring share={percent / 100} thickness={27.5} gap>
                            <span className="text-[14px] font-bold">{percent}%</span>
                        </Ring>
                        {occupancy && (
                            <div className="flex max-w-[220px] shrink-0 flex-col items-center gap-3 text-center">
                                <Ring share={occupancy.member ? 1 : remaining / FREE_VACANCIES_LIMIT}>
                                    {occupancy.member
                                        ? <span className="text-[26px] font-medium text-ink-secondary">∞</span>
                                        : <span className="text-[14px] font-bold text-ink-secondary">{`${remaining}/${FREE_VACANCIES_LIMIT}`}</span>}
                                </Ring>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[14px] font-semibold text-ink-secondary">{occupancy.member ? labels.quota.unlimited : labels.quota.left}</span>
                                    <a href={routes.membership} className="text-[13px] leading-[1.3] whitespace-pre-line text-primary underline">{occupancy.member ? labels.quota.unlimitedHint : labels.quota.leftHint}</a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-[2fr_1fr] items-start gap-[1.875rem] pt-[1.875rem] pb-14 down-lg:grid-cols-1">
                <div className={panel}>
                    <div className={panelTitle}>
                        <h3 className="text-[1.125rem] font-semibold">{labels.requests}</h3>
                        <p className="text-primary">{labels.newRequests}: <span className="ml-1.5">{newCount}</span></p>
                    </div>
                    <div className="flex min-h-[450px] flex-col gap-[30px] bg-white p-[30px]">
                        {/* Порядок как в старом: column-reverse — первая заявка из ответа внизу */}
                        <div className="flex flex-col-reverse gap-3.5">
                            {applications === null && <p>{labels.loading}</p>}
                            {applications?.length === 0 && <p className="text-[14px] leading-[120%] font-medium down-lg:text-center">{labels.empty}</p>}
                            {applications?.map((application) => (
                                <ApplicationCard
                                    key={application.id}
                                    application={application}
                                    routes={routes}
                                    onStatus={(next) => void status.change(application.id, next)}
                                    onReview={() => setReview(application)}
                                    labels={labels.card}
                                />
                            ))}
                        </div>
                        {!!applications?.length && (
                            <a href={routes.notes} className="flex items-center justify-center rounded-[10px] border border-primary bg-primary px-[100px] py-3 text-label text-white no-underline transition-all duration-300 hover:bg-white hover:text-primary down-lg:px-[15px]">
                                {labels.showAll}
                            </a>
                        )}
                    </div>
                </div>
                <div className="flex w-full max-w-[468px] flex-col down-lg:max-w-none">
                    {/* Только без членства и после ответа (в старом баннер мигал у членов) */}
                    {occupancy && !occupancy.member && <MemberBanner locale={locale} title={labels.memberTitle} button={labels.memberButton} anchor="host" className="down-lg:max-w-none" />}
                    <div className={panel}>
                        <div className={panelTitle}><h3 className="text-[1.125rem] font-semibold">{labels.notifications}</h3></div>
                        <div className="flex min-h-[450px] flex-col gap-3.5 bg-white p-[30px]">
                            <div className="flex cursor-pointer flex-col">
                                <p className="text-[14px] font-bold text-primary">{labels.welcome}</p>
                                <p className="mt-[3px] text-[12px] font-medium text-muted">{notificationDate}</p>
                                <p className="mt-[3px] text-[12px] leading-4 text-ink-secondary">{labels.welcomeText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <HostReviewDialog
                volunteer={review && { vacancyId: review.vacancy.id, volunteerId: review.volunteer.id, firstName: review.volunteer.firstName, lastName: review.volunteer.lastName, image: review.volunteer.image, country: review.volunteer.country, city: review.volunteer.city, status: review.status }}
                volunteerHref={review ? routes.volunteer.replace("{id}", review.volunteer.id) : ""}
                title={labels.reviewTitle}
                photos={false}
                onClose={() => setReview(null)}
                onSent={() => void loadApplications()}
                labels={labels.dialog}
            />
        </div>
    );
}
