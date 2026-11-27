"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { reachGoal } from "@/components/analytics/YandexMetrika";
import { useReportLabels } from "@/components/report/ReportContext";
import { ReportDialog } from "@/components/report/ReportDialog";
import { useBlocks } from "@/components/report/useBlocks";
import { useSession } from "@/components/session/SessionProvider";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import { API_URL, browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import {
    type ApplicationStatus, type Chat, type ChatApplication, type ChatMessage, companionTarget, formatDayLabel, formatTime, idFromIri, readByOthers, sameGroup, type Terms,
} from "@/lib/messenger";
import type { CatalogOffer } from "@/lib/offersCatalog";
import { applyDates, initialTerms } from "@/lib/applyDates";
import { dayFromApi, today } from "@/lib/offerWizard";
import { blockedSendText, type ReportTarget } from "@/lib/report";

import { type ApplicationLabels, ApplicationEvent } from "./ApplicationBlock";
import { type ApplyFormLabels, ApplyForm, ApplyFormError, ApplyFormSkeleton } from "./ApplyForm";
import { needsIntro, QuickIntro, type QuickIntroLabels } from "./QuickIntro";
import { ResponseHintNote, type ResponseHintLabels } from "./ResponseHintNote";
import { ChatActions } from "./ChatActions";
import { ChatHeader } from "./ChatHeader";
import { type ChatInputLabels, ChatInput, type OutgoingMessage } from "./ChatInput";
import { type ChatListLabels, ChatList } from "./ChatList";
import { type CompanionLabels, type CompanionProfile, CompanionInfo } from "./CompanionInfo";
import { MessageBubble } from "./MessageBubble";
import { type PushOfferLabels, PushOffer } from "./PushOffer";
import { type ReplyDraftLabels, ReplyDraft } from "./ReplyDraft";
import { useChatList, useChatMessages, useLiveMessages } from "./useMessenger";

export interface MessengerLabels {
    /** Над откликом новичка без имени или фото */
    intro: QuickIntroLabels;
    hint: ResponseHintLabels;
    title: string;
    choose: string;
    /** Пустые «Сообщения» волонтёра на телефоне (GS-291) */
    emptyVolunteer: { title: string; hint: string; find: string };
    back: string;
    info: string;
    /** Полоса под шапкой у новой заявки (организатору) */
    decisionPrompt: string;
    /** Подтверждение отказа и «Изменить решение» у принятой или отклонённой заявки */
    declineConfirm: string;
    cancel: string;
    changeDecision: string;
    changePrompt: string;
    offerNotFound: string;
    applicationSent: string;
    sendError: string;
    error: string;
    close: string;
    list: ChatListLabels;
    input: ChatInputLabels;
    application: ApplicationLabels;
    apply: ApplyFormLabels;
    /** Отклик не ушёл из-за сети */
    applyNetworkError: string;
    companion: CompanionLabels;
    push: PushOfferLabels;
    draft: ReplyDraftLabels;
}

export interface MessengerHrefs {
    /** Шаблоны с {id} */
    messenger: string;
    chat: string;
    offer: string;
    volunteer: string;
    organization: string;
    /** «Найти вакансию» из пустых «Сообщений» */
    catalog: string;
}

/** Поля вакансии, нужные карточке заявки (GET /api/v1/vacancies/{id} и вакансия в заявке) */
interface OfferFields {
    id?: number;
    status?: string;
    acceptedApplicationsCount?: number;
    averageRating?: number | null;
    reviewsCount?: number | null;
    description?: { title?: string | null; shortDescription?: string | null; categories?: { name?: string }[] | null } | null;
    where?: { address?: string | null } | null;
    // У периода конец — ending (раньше форма читала end, и единственный период не подставлялся)
    when?: { isFullYearAcceptable?: boolean; durationMinDays?: number | null; durationMaxDays?: number | null; periods?: { start?: string | null; ending?: string | null }[] | null } | null;
}

const toCatalogOffer = (offer: OfferFields, categories: Record<string, string>): CatalogOffer => ({
    id: offer.id ?? 0,
    title: offer.description?.title ?? "",
    description: offer.description?.shortDescription ?? "",
    address: offer.where?.address ?? "",
    category: categories[offer.description?.categories?.[0]?.name ?? ""] ?? offer.description?.categories?.[0]?.name,
    rating: Number((offer.averageRating ?? 0).toFixed(1)),
    reviews: offer.reviewsCount ?? 0,
    went: offer.acceptedApplicationsCount ?? 0,
    active: offer.status === "active",
    onMap: true,
});

/** Заявка в переписке: сообщение со ссылкой на заявку */
interface ApplicationData {
    id: string;
    offer: CatalogOffer;
    terms: Terms;
    status: ApplicationStatus;
    volunteerId?: string;
}

const fullName = (person: { firstName?: string | null; lastName?: string | null } | null | undefined, fallback: string) => [person?.firstName, person?.lastName].filter(Boolean).join(" ") || fallback;

/**
 * Сообщения (MessengerPage старого фронта): слева список чатов, справа
 * переписка с собеседником; на телефоне — что-то одно. Адреса: /messenger,
 * /messenger/:id, /messenger/create/:offerId (отклик на вакансию: даты и
 * заявка), /messenger/create?recipientVolunteer=…|recipientOrganization=…
 * (первое сообщение). Новые сообщения — через Mercure.
 */
export function Messenger({ locale, chatId, offerId, labels, hrefs, dict }: {
    locale: Locale;
    chatId?: string;
    offerId?: string;
    labels: MessengerLabels;
    hrefs: MessengerHrefs;
    dict: { skills: Record<string, string>; languages: Record<string, string>; levels: Record<string, string>; categories: Record<string, string> };
}) {
    const session = useSession();
    const router = useRouter();
    const params = useSearchParams();
    const token = session.token;
    const me = session.profile;
    const ready = session.status === "user";
    const isCreate = chatId === "create";
    // Решаем один раз: после сохранения имени блок не должен пропасть посреди ввода
    const [introShown, setIntroShown] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (isCreate && ready && needsIntro(me as Record<string, unknown> | null)) setIntroShown(true);
    }, [isCreate, ready]); // eslint-disable-line react-hooks/exhaustive-deps
    const realChatId = chatId && !isCreate ? chatId : undefined;
    const recipientVolunteer = params.get("recipientVolunteer") ?? undefined;
    const recipientOrganization = params.get("recipientOrganization") ?? undefined;

    const list = useChatList(token, ready, locale);
    const chat = useChatMessages(token, ready ? realChatId : undefined);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const fail = useCallback((text: string) => setToast({ text, ok: false }), []);

    // Пожаловаться и заблокировать (GS-282): подписи кладёт страница; без них — ни меню, ни флажков
    const report = useReportLabels();
    const blocks = useBlocks(ready && !!report);
    const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
    const [blockConfirm, setBlockConfirm] = useState(false);
    const [blocking, setBlocking] = useState(false);

    // Значок в шапке обновляется вместе со списком, а не раз в минуту (тестировщик, 07.11)
    const { refreshUnread } = session;
    const onLive = useCallback((message: ChatMessage) => {
        list.applyMessage(message);
        chat.addMessage(message);
        refreshUnread();
    }, [chat, list, refreshUnread]);
    const onPoll = useCallback(() => {
        void list.reload();
        void chat.refresh();
        refreshUnread();
    }, [chat, list, refreshUnread]);
    useLiveMessages(ready ? me?.id : undefined, onLive, onPoll);

    const href = (template: string, id: string | number) => template.replace("{id}", String(id));
    const open = useCallback((id?: number | string) => {
        router.push(id && String(id) !== chatId ? href(hrefs.chat, id) : hrefs.messenger);
    }, [chatId, hrefs.chat, hrefs.messenger, router]);

    // Собеседник: из чата или из адреса создания
    const [companion, setCompanion] = useState<CompanionProfile | null>(null);
    const [participant, setParticipant] = useState<{ id?: string | null; firstName?: string | null; lastName?: string | null; image?: unknown } | null>(null);
    // Заявка открытого чата из GET /chats/{id}: если чата нет в загруженном списке (поиск, список ещё грузится)
    const [chatApplication, setChatApplication] = useState<ChatApplication | null>(null);
    useEffect(() => {
        if (!ready) return;
        let cancelled = false;
        const loadProfile = async (id: string | undefined | null) => {
            if (!id) return;
            const result = await browserApi(token).GET("/api/v1/profile/{id}", { params: { path: { id } } }).catch(() => null);
            if (!cancelled && result?.data) setCompanion(result.data);
        };
        // Другой чат — прежний собеседник не показывается, пока грузится новый
        /* eslint-disable react-hooks/set-state-in-effect */
        setCompanion(null);
        setParticipant(null);
        setChatApplication(null);
        /* eslint-enable react-hooks/set-state-in-effect */
        if (realChatId) {
            void browserApi(token).GET("/api/v1/chats/{id}", { params: { path: { id: realChatId } } }).then(({ data }) => {
                const other = data?.otherParticipants?.[0] ?? null;
                if (cancelled) return;
                setParticipant(other);
                setChatApplication(data?.application ?? null);
                void loadProfile(other?.id);
            }).catch(() => undefined);
        } else if (isCreate && recipientVolunteer) {
            void loadProfile(recipientVolunteer);
        }
        return () => {
            cancelled = true;
        };
    }, [ready, token, realChatId, isCreate, recipientVolunteer]);

    // Отклик на вакансию: вакансия, даты, «Пару слов о себе» (GS-290)
    const [offer, setOffer] = useState<OfferFields | null>(null);
    const [offerState, setOfferState] = useState<"loading" | "ready" | "failed">("loading");
    const [offerAttempt, setOfferAttempt] = useState(0);
    const [terms, setTerms] = useState<Terms>({ start: null, end: null });
    const [applyMessage, setApplyMessage] = useState("");
    const [applying, setApplying] = useState(false);
    const [applyError, setApplyError] = useState<string | null>(null);
    const dates = useMemo(() => applyDates(offer?.when, today()), [offer]);
    useEffect(() => {
        if (!ready || !isCreate || !offerId) return;
        let cancelled = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- повтор после ошибки: снова заглушка
        setOfferState("loading");
        void browserApi(token)
            .GET("/api/v1/vacancies/{id}", { params: { path: { id: offerId } }, headers: { Accept: "application/json" } })
            .then(({ data, response }) => {
                if (cancelled) return;
                if (!data) {
                    // 4xx — вакансии нет; 5xx — сбой, можно повторить
                    setOfferState(response.status >= 500 ? "failed" : "ready");
                    fail(labels.offerNotFound);
                    return;
                }
                const loaded = data as OfferFields;
                setOffer(loaded);
                setTerms(initialTerms(applyDates(loaded.when, today())));
                setOfferState("ready");
            })
            .catch(() => {
                if (!cancelled) setOfferState("failed");
            });
        return () => {
            cancelled = true;
        };
    }, [ready, token, isCreate, offerId, fail, labels.offerNotFound, offerAttempt]);

    const apply = async () => {
        if (!offerId || !terms.start || !terms.end || applying) return;
        setApplying(true);
        setApplyError(null);
        setToast(null);
        const text = applyMessage.trim();
        const result = await browserApi(token)
            .POST("/api/v1/applications", {
                body: { vacancy: `/api/v1/vacancies/${offerId}`, startDate: terms.start, endDate: terms.end, ...(text ? { message: text } : {}) },
                headers: { Accept: "application/json" },
            })
            .catch(() => null);
        setApplying(false);
        const created = result?.data as { chat?: string | null } | undefined;
        if (!result) {
            // Сеть: введённое остаётся в форме, можно нажать ещё раз
            setApplyError(labels.applyNetworkError);
            return;
        }
        if (!result.response.ok || !created) {
            const error = (result.error ?? null) as { detail?: string; title?: string } | null;
            setApplyError((report && blockedSendText(error, report)) || error?.detail || error?.title || labels.error);
            return;
        }
        reachGoal("application_sent", text ? { message: "yes" } : undefined);
        setToast({ text: labels.applicationSent, ok: true });
        const newChat = idFromIri(created.chat);
        if (newChat) router.push(href(hrefs.chat, newChat));
    };

    // Прочитано: последнее сообщение открытого чата — один раз на сообщение
    const lastRead = useRef<Record<string, number>>({});
    useEffect(() => {
        const latest = chat.messages[0];
        if (!realChatId || typeof latest?.id !== "number" || lastRead.current[realChatId] === latest.id) return;
        lastRead.current[realChatId] = latest.id;
        void browserApi(token)
            .POST("/api/v1/chats/read", { body: { message: `${API_URL}/api/v1/messages/${latest.id}` } })
            .then(() => {
                list.markRead(Number(realChatId));
                refreshUnread();
            })
            .catch(() => undefined);
    }, [chat.messages, realChatId, token, list, refreshUnread]);

    // Заявки внутри переписки
    const [applications, setApplications] = useState<Record<string, ApplicationData | null>>({});
    useEffect(() => {
        const missing = chat.messages.map((message) => idFromIri(message.applicationForm)).filter((id): id is string => !!id && !(id in applications));
        if (missing.length === 0) return;
        for (const id of missing) {
            // Отмечаем заявку как запрошенную, чтобы не запрашивать её повторно на следующем рендере
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setApplications((current) => ({ ...current, [id]: null }));
            void browserApi(token).GET("/api/v1/applications/{id}", { params: { path: { id } } }).then(({ data }) => {
                if (!data) return;
                setApplications((current) => ({
                    ...current,
                    [id]: {
                        id,
                        offer: toCatalogOffer((data.vacancy ?? {}) as OfferFields, dict.categories),
                        terms: { start: dayFromApi(data.startDate), end: dayFromApi(data.endDate) },
                        status: data.status,
                        volunteerId: (data.volunteer as { profile?: { id?: string } } | null | undefined)?.profile?.id,
                    },
                }));
            }).catch(() => undefined);
        }
    }, [chat.messages, applications, token, dict.categories]);

    const decide = async (applicationId: string, status: "accepted" | "canceled"): Promise<boolean> => {
        const result = await browserApi(token)
            .PATCH("/api/v1/application_forms/{id}/status", {
                params: { path: { id: applicationId } },
                body: { status },
                headers: { "Content-Type": "application/merge-patch+json" },
            })
            .catch(() => null);
        if (!result?.response.ok) {
            fail(labels.error);
            return false;
        }
        reachGoal(status === "accepted" ? "application_accepted" : "application_rejected", { from: "chat" });
        if (realChatId) list.setApplicationStatus(Number(realChatId), status);
        setChatApplication((current) => (current && String(current.id) === applicationId ? { ...current, status } : current));
        setApplications((current) => {
            const item = current[applicationId];
            return item ? { ...current, [applicationId]: { ...item, status } } : current;
        });
        return true;
    };

    const send = async (message: OutgoingMessage) => {
        const body = isCreate && (recipientVolunteer || recipientOrganization)
            ? {
                recipient: recipientVolunteer ? `/api/v1/users/${recipientVolunteer}` : undefined,
                recipientOrganization: recipientOrganization ? `/api/v1/organizations/${recipientOrganization}` : undefined,
                text: message.text,
                attachments: message.attachments,
            }
            : { chat: `/api/v1/chats/${realChatId}`, text: message.text, attachments: message.attachments };
        const result = await browserApi(token).POST("/api/v1/messages", { body, headers: { Accept: "application/json" } }).catch(() => null);
        const sent = result?.data as ChatMessage | undefined;
        if (!result?.response.ok || !sent) {
            // Собеседник заблокировал (или вы его) — понятный текст вместо общей ошибки
            fail((report && blockedSendText(result?.error, report)) || labels.sendError);
            return;
        }
        if (isCreate) {
            const newChat = idFromIri(sent.chat);
            if (newChat) router.push(href(hrefs.chat, newChat));
            return;
        }
        // Своё сообщение — сразу, не дожидаясь Mercure
        chat.addMessage({ ...sent, chat: sent.chat ?? `/api/v1/chats/${realChatId}` });
        void list.reload();
    };

    const [infoOpen, setInfoOpen] = useState(false);
    // Черновик ответа хоста от помощника — подставляется в поле ввода
    const [draft, setDraft] = useState<{ text: string; key: number } | null>(null);
    const [image, setImage] = useState<string | null>(null);

    const headerPerson = companion ?? participant;
    const companionName = fullName(headerPerson, labels.list.noName);
    const companionAvatar = mediaUrl((companion?.image ?? participant?.image) as never, "small");
    const target = companionTarget(companion ?? (participant?.id ? { id: participant.id } : null), !!me?.hostId);
    const companionHref = target ? href(target.kind === "organization" ? hrefs.organization : hrefs.volunteer, target.id) : undefined;
    const myName = fullName(me, labels.list.noName);
    // Собеседник открытой переписки — для жалобы и блокировки
    const companionId = participant?.id ?? companion?.id ?? undefined;
    const companionBlocked = blocks.items === null || !companionId ? null : blocks.isBlocked(companionId);
    const toggleBlock = async () => {
        if (!report || !companionId) return;
        setBlocking(true);
        const wasBlocked = !!companionBlocked;
        const ok = wasBlocked ? await blocks.unblock(companionId) : await blocks.block(companionId);
        setBlocking(false);
        setBlockConfirm(false);
        if (!ok) {
            fail(report.blockError);
            return;
        }
        setToast({ text: wasBlocked ? report.unblocked : report.blocked, ok: true });
        // Заблокированная переписка пропадает из списка — возвращаемся к нему
        void list.reload();
        if (!wasBlocked) open();
    };

    // Кто вошёл в этой переписке: организатор, если заявка на вакансию его организации
    const viewerIsVolunteer = useCallback((item: Pick<Chat, "application">) => (item.application ? item.application.organizationId !== me?.hostId : !me?.hostId), [me?.hostId]);
    const listChat = realChatId ? list.chats.find((item) => String(item.id) === realChatId) : undefined;
    const application = listChat?.application ?? chatApplication;
    const volunteerHere = viewerIsVolunteer({ application });

    // Переписка снизу вверх (column-reverse): свежие сообщения внизу, в массиве — первыми. Разделитель
    // дня — над первым сообщением дня («Сегодня», «Вчера», «5 ноября»); подряд идущие сообщения одного
    // автора — группа: аватар собеседника и «хвостик» только у последнего в группе
    const rendered = useMemo(() => {
        const items: React.ReactNode[] = [];
        const messages = chat.messages;
        messages.forEach((message, index) => {
            const newer = messages[index - 1];
            const older = messages[index + 1];
            const authorId = idFromIri(message.author);
            const own = authorId === me?.id;
            const applicationId = idFromIri(message.applicationForm);
            const messageDay = new Date(message.createdAt ?? 0).toDateString();
            const dayStart = !older || new Date(older.createdAt ?? 0).toDateString() !== messageDay;
            const groupEnd = !newer || !!idFromIri(newer.applicationForm) || !sameGroup(message, newer) || new Date(newer.createdAt ?? 0).toDateString() !== messageDay;
            const groupStart = dayStart || !!(older && idFromIri(older.applicationForm)) || !sameGroup(message, older);
            let node: React.ReactNode = null;
            if (applicationId) {
                const item = applications[applicationId];
                node = item
                    ? (
                        <ApplicationEvent
                            locale={locale}
                            title={item.offer.title}
                            offerHref={href(hrefs.offer, item.offer.id)}
                            terms={item.terms}
                            username={own ? myName : companionName}
                            labels={labels.application}
                        />
                    )
                    // Место под карточку заявки, пока она грузится
                    : <div aria-hidden className="mx-auto my-3 h-[76px] w-full max-w-[420px] animate-pulse rounded-[14px] bg-white/70" />;
            } else {
                node = (
                    <MessageBubble
                        own={own}
                        name={companionName}
                        avatar={companionAvatar}
                        showAvatar={!own && groupEnd}
                        profileHref={companionHref}
                        text={message.text ?? ""}
                        attachment={message.attachments?.[0]}
                        time={formatTime(locale, message.createdAt)}
                        read={own && readByOthers(message, me?.id)}
                        readLabel={labels.list.read}
                        groupEnd={groupStart}
                        token={token}
                        onImage={setImage}
                        onReport={!own && report && message.id !== undefined ? () => setReportTarget({ type: "message", id: String(message.id) }) : undefined}
                        reportLabel={report?.reportMessage}
                    />
                );
            }
            // Заметка «как отвечает организатор» — волонтёру, под его новой заявкой (column-reverse: в разметке раньше)
            const hintHere = applicationId !== undefined && volunteerHere && application?.status === "new" && String(application.id) === applicationId;
            items.push(
                <Fragment key={message.id}>
                    {hintHere && <ResponseHintNote applicationId={applicationId} token={token} offerHref={hrefs.offer} labels={labels.hint} />}
                    {node}
                    {/* column-reverse: разделитель идёт после сообщения в разметке, на экране — над ним */}
                    {dayStart && (
                        <div className="my-3 flex justify-center">
                            <span className="rounded-full bg-white/90 px-3 py-1 text-[12px] font-medium text-caption shadow-[0_1px_2px_rgba(14,29,39,0.06)]">{formatDayLabel(locale, message.createdAt ?? "")}</span>
                        </div>
                    )}
                </Fragment>,
            );
        });
        return items;
        // href — без состояния, пересоздаётся при каждом рендере
         
    }, [chat.messages, applications, me?.id, myName, companionName, companionAvatar, companionHref, locale, token, labels, hrefs, volunteerHere, application?.status, application?.id, report]);

    const hasChat = !!chatId;
    const scroller = useRef<HTMLDivElement>(null);
    const applicationId = application?.id ? String(application.id) : undefined;

    return (
        <div className="mx-[50px] mt-5 mb-[18px] flex h-[calc(100vh-200px)] min-h-[480px] flex-1 flex-col down-lg:mx-5 down-lg:mt-0 down-lg:h-[calc(100dvh-110px)] down-xs:mx-0">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
            {report && (
                <>
                    <ReportDialog
                        target={reportTarget}
                        title={reportTarget?.type === "message" ? report.reportMessage : report.reportUser}
                        labels={report}
                        onClose={() => setReportTarget(null)}
                        onSent={() => {
                            setReportTarget(null);
                            setToast({ text: report.sent, ok: true });
                        }}
                    />
                    <ConfirmDialog
                        open={blockConfirm}
                        text={companionBlocked ? report.unblockConfirm : report.blockConfirm}
                        confirm={companionBlocked ? report.unblock : report.block}
                        cancel={report.cancel}
                        busy={blocking}
                        onConfirm={() => void toggleBlock()}
                        onClose={() => setBlockConfirm(false)}
                    />
                </>
            )}
            <h2 className="text-[1.5em] font-normal down-lg:hidden">{labels.title}</h2>
            <div className="mt-5 flex h-full min-h-0 flex-1 overflow-hidden rounded-[14px] border border-accent-bg bg-white down-lg:mt-0 down-xs:rounded-none down-xs:border-x-0">
                <ChatList
                    locale={locale}
                    chats={list.chats}
                    loaded={list.loaded}
                    failed={list.failed}
                    onRetry={() => void list.reload()}
                    myId={me?.id}
                    viewerIsVolunteer={viewerIsVolunteer}
                    selectedId={realChatId}
                    chatHref={(id) => href(hrefs.chat, id)}
                    onOpen={open}
                    search={list.search}
                    onSearch={list.setSearch}
                    labels={labels.list}
                    top={<PushOffer token={token} enabled={ready && list.loaded} hasChats={list.chats.length > 0} labels={labels.push} />}
                    emptyPhone={ready && !me?.hostId ? { title: labels.emptyVolunteer.title, hint: labels.emptyVolunteer.hint, action: { href: hrefs.catalog, label: labels.emptyVolunteer.find } } : undefined}
                    className={hasChat ? "down-lg:hidden" : "down-lg:flex down-lg:max-w-none"}
                />
                {!hasChat ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-field text-[15px] text-caption down-lg:hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element -- значок пустого чата */}
                        <img src="/web/icons/messenger/chat.svg" alt="" className="h-12 w-12 opacity-60" />
                        <span>{labels.choose}</span>
                    </div>
                ) : (
                    // На телефоне открытая переписка — на весь экран, как в приложениях: шапка сайта не отнимает место у сообщений
                    <div className="relative flex h-full min-w-0 flex-1 bg-field down-lg:fixed down-lg:inset-0 down-lg:z-[60] down-lg:h-[100dvh]">
                        <div className="flex h-full min-w-0 flex-1 flex-col">
                            <ChatHeader
                                locale={locale}
                                name={isCreate && !recipientVolunteer && !participant ? "" : companionName}
                                avatar={companionAvatar}
                                profileHref={companionHref}
                                application={application}
                                viewerIsVolunteer={volunteerHere}
                                offerHref={application?.vacancyId ? href(hrefs.offer, application.vacancyId) : undefined}
                                infoOpen={infoOpen}
                                onInfo={companion ? () => setInfoOpen((value) => !value) : undefined}
                                onBack={() => open()}
                                onDecision={applicationId ? (status) => decide(applicationId, status) : undefined}
                                actions={report && realChatId && companionId ? (
                                    <ChatActions
                                        blocked={companionBlocked}
                                        onReport={() => setReportTarget({ type: "user", id: companionId })}
                                        onBlock={() => setBlockConfirm(true)}
                                        labels={{ menu: report.menu, report: report.reportUser, block: report.block, unblock: report.unblock }}
                                    />
                                ) : undefined}
                                labels={{
                                    back: labels.back,
                                    info: labels.info,
                                    statuses: labels.list.statuses,
                                    decisionPrompt: labels.decisionPrompt,
                                    accept: labels.application.accept,
                                    decline: labels.application.decline,
                                    declineConfirm: labels.declineConfirm,
                                    cancel: labels.cancel,
                                    change: labels.changeDecision,
                                    changePrompt: labels.changePrompt,
                                }}
                            />
                            {isCreate && offerId ? (
                                // Отклик — обычная форма сверху вниз, не лента сообщений
                                <div className="flex min-h-0 w-full flex-1 flex-col overflow-auto px-4 pt-4 down-xs:px-3">
                                    {/* Нет имени или фото при открытии — блок над формой; после сохранения — с «Сохранено» */}
                                    {introShown && <div className="mx-auto w-full max-w-[560px]"><QuickIntro labels={labels.intro} /></div>}
                                    {offer ? (
                                        <ApplyForm
                                            locale={locale}
                                            offer={toCatalogOffer(offer, dict.categories)}
                                            offerHref={href(hrefs.offer, offer.id ?? offerId)}
                                            dates={dates}
                                            terms={terms}
                                            onTerms={setTerms}
                                            message={applyMessage}
                                            onMessage={setApplyMessage}
                                            onSubmit={() => void apply()}
                                            busy={applying}
                                            error={applyError}
                                            labels={labels.apply}
                                        />
                                    ) : offerState === "failed" ? (
                                        <ApplyFormError text={labels.apply.loadError} retry={labels.apply.retry} onRetry={() => setOfferAttempt((value) => value + 1)} />
                                    ) : offerState === "loading" ? <ApplyFormSkeleton /> : null}
                                </div>
                            ) : (
                                <div
                                    ref={scroller}
                                    className="flex min-h-0 w-full flex-1 flex-col-reverse overflow-auto px-4 pt-2 pb-4 down-xs:px-2.5"
                                    onScroll={(event) => {
                                        const box = event.currentTarget;
                                        // column-reverse: scrollTop отрицательный, верх — у -(scrollHeight - clientHeight)
                                        if (box.scrollHeight - box.clientHeight + box.scrollTop < 80) chat.loadMore();
                                    }}
                                >
                                    {rendered}
                                    {realChatId && chat.loading && chat.messages.length === 0 && <MessagesSkeleton />}
                                </div>
                            )}
                            {!(isCreate && offerId) && (
                                <ChatInput
                                    token={token}
                                    disabled={!ready || (isCreate && !recipientVolunteer && !recipientOrganization)}
                                    labels={labels.input}
                                    onSend={(message) => void send(message)}
                                    onError={fail}
                                    prefill={draft}
                                    extra={application?.id && !volunteerHere && realChatId ? (
                                        <ReplyDraft
                                            key={realChatId}
                                            token={token}
                                            applicationId={application.id}
                                            onDraft={(text) => setDraft({ text, key: Date.now() })}
                                            onError={fail}
                                            labels={labels.draft}
                                        />
                                    ) : null}
                                />
                            )}
                        </div>
                        {companion && (
                            <CompanionInfo
                                locale={locale}
                                user={companion}
                                name={companionName}
                                hrefs={{ volunteer: hrefs.volunteer, organization: hrefs.organization, offer: hrefs.offer }}
                                dict={dict}
                                open={infoOpen}
                                onClose={() => setInfoOpen(false)}
                                labels={labels.companion}
                            />
                        )}
                    </div>
                )}
            </div>
            <Dialog.Root open={!!image} onOpenChange={(value) => !value && setImage(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
                        <Dialog.Content className="relative outline-none" aria-describedby={undefined}>
                            <Dialog.Title className="sr-only">{labels.title}</Dialog.Title>
                            {/* eslint-disable-next-line @next/next/no-img-element -- вложение с API */}
                            {image && <img loading="eager" src={image} alt="" className="max-h-[90vh] max-w-[80vw] object-contain down-xs:max-w-[90vw]" />}
                            <Dialog.Close aria-label={labels.close} className="absolute -top-8 right-0 cursor-pointer border-0 bg-transparent text-[28px] leading-none text-white">×</Dialog.Close>
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}

/** Заглушка переписки, пока грузится первая страница */
function MessagesSkeleton() {
    return (
        <div aria-hidden className="flex flex-col gap-3 py-4">
            <span className="h-10 w-[55%] animate-pulse rounded-[18px] bg-white" />
            <span className="ml-auto h-10 w-[45%] animate-pulse rounded-[18px] bg-primary/20" />
            <span className="h-16 w-[60%] animate-pulse rounded-[18px] bg-white" />
        </div>
    );
}
