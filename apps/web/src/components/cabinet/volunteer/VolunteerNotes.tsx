"use client";

import type { components } from "@goodsurfing/api";
import { useEffect, useState } from "react";

import { PageButtons } from "@/components/list/PageButtons";
import { useSession } from "@/components/session/SessionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { textSlice } from "@/lib/textSlice";

import { OfferReviewDialog, type OfferReviewDialogLabels } from "./OfferReviewDialog";

type Application = components["schemas"]["ListOfVolunteerResult"];
type Status = "new" | "accepted" | "canceled";

const PER_PAGE = 10;
const STATUSES: Status[] = ["new", "accepted", "canceled"];
/** Цвет полосы под заголовком колонки и плашки статуса (statusColors старого фронта) */
const COLUMN_COLOR: Record<Status, string> = { new: "border-b-status-new", accepted: "border-b-status-accepted", canceled: "border-b-status-rejected" };
/** Плашка статуса в окне отзыва: --color-blue, --color-green, --color-pink старого фронта */
const BADGE_COLOR: Record<Status, string> = { new: "bg-primary", accepted: "bg-host", canceled: "bg-status-rejected" };

export interface VolunteerNotesLabels {
    statuses: Record<Status, string>;
    message: string;
    review: string;
    noTitle: string;
    noAddress: string;
    sendError: string;
    pagination: { prev: string; next: string; page: string };
    dialog: OfferReviewDialogLabels;
}

const isStatus = (value: string): value is Status => (STATUSES as string[]).includes(value);

/**
 * «Мои заявки» волонтёра (NotesVolunteerForm + NotesWidget старого фронта):
 * заявки текущей страницы (по 10) в трёх колонках по статусу, без
 * перетаскивания; у принятой без отзыва — «Написать отзыв».
 */
export function VolunteerNotes({ hrefs, categories, labels }: {
    hrefs: { offer: string; chat: string };
    categories: Record<string, string>;
    labels: VolunteerNotesLabels;
}) {
    const session = useSession();
    const [page, setPage] = useState(1);
    const [data, setData] = useState<{ items: Application[]; total: number } | null>(null);
    const [selected, setSelected] = useState<Application | null>(null);

    // Увеличивается после отзыва — список перечитывается («Написать отзыв» пропадает)
    const [version, setVersion] = useState(0);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token)
            .GET("/api/v1/application/list-of-volunteer", { params: { query: { limit: String(PER_PAGE), page: String(page) } } })
            .catch(() => ({ data: undefined }))
            .then(({ data: response }) => !cancelled && setData({ items: response?.data ?? [], total: response?.pagination?.total ?? 0 }));
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, page, version]);

    if (!data) return <Spinner className="max-w-[1400px]" />;

    const category = (application: Application) => {
        const name = (application.vacancy.categories[0] as { name?: string } | undefined)?.name?.trim();
        return name ? categories[name] ?? name : undefined;
    };
    const offerCard = (application: Application) => (
        <a href={hrefs.offer.replace("{id}", String(application.vacancy.id))} className="flex gap-2 text-inherit no-underline">
            <Avatar src={mediaUrl(application.vacancy.image, "small")} name={application.vacancy.title} size={56} />
            <div className="flex flex-col gap-1">
                <span className="text-[14px] font-medium text-ink">{textSlice(application.vacancy.title, 45, labels.noTitle)}</span>
                <span className="text-[12px] font-medium text-caption">{textSlice(application.vacancy.address, 23, labels.noAddress)}</span>
                <span className="text-[12px] font-medium text-primary">{category(application)}</span>
            </div>
        </a>
    );
    const button = "mt-3.5 h-min w-full cursor-pointer rounded-[10px] border border-primary p-[7px] text-center text-label text-primary no-underline transition-all duration-300 hover:bg-primary hover:text-white";

    return (
        <div className="flex w-full max-w-[1400px] flex-col items-center gap-10">
            <div className="mt-10 grid w-full grid-cols-3 gap-5 max-[756px]:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] max-[442px]:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                {STATUSES.map((status) => {
                    const items = data.items.filter((item) => item.status === status);
                    return (
                        <section key={status} aria-label={labels.statuses[status]} className="h-full min-h-[500px] w-full bg-white shadow-[0_5px_20px_0_rgba(14,29,39,0.05)]">
                            <div className={`flex justify-between border-b-2 px-5 py-3.5 ${COLUMN_COLOR[status]}`}>
                                <span className="text-[18px] font-medium text-ink-secondary">{labels.statuses[status]}</span>
                                <span className="text-[14px] font-medium text-primary">{items.length}</span>
                            </div>
                            <div className="flex h-full w-full flex-col px-3.5 pb-[30px]">
                                {items.map((application) => (
                                    <article key={application.id} className="mt-3.5 flex min-h-[100px] w-full flex-col border border-accent-bg bg-white p-3.5 select-none">
                                        <div className="mt-1">{offerCard(application)}</div>
                                        <div className="flex flex-wrap">
                                            {!!application.chatId && <a href={hrefs.chat.replace("{id}", String(application.chatId))} className={button}>{labels.message}</a>}
                                            {status === "accepted" && !application.isHasReview && (
                                                <button type="button" onClick={() => setSelected(application)} className={button}>{labels.review}</button>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
            <PageButtons page={page} count={Math.ceil(data.total / PER_PAGE)} onChange={setPage} labels={labels.pagination} />
            <OfferReviewDialog
                open={!!selected}
                labels={labels.dialog}
                assistant={selected ? { token: session.token, vacancyId: selected.vacancy.id } : undefined}
                onClose={() => setSelected(null)}
                offer={selected && (
                    <div className="flex min-h-[100px] w-full flex-col border border-accent-bg bg-white p-3.5 select-none">
                        {isStatus(selected.status) && (
                            <div className={`box-content max-h-min max-w-min self-end rounded-[2px] px-1.5 py-[3px] text-[10px] text-white ${BADGE_COLOR[selected.status]}`}>{labels.statuses[selected.status]}</div>
                        )}
                        <div className="mt-1">{offerCard(selected)}</div>
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
                    setVersion((value) => value + 1);
                    return null;
                }}
            />
        </div>
    );
}
