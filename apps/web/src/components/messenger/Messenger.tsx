"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { reachGoal } from "@/components/analytics/YandexMetrika";
import { useSession } from "@/components/session/SessionProvider";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import { API_URL, browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import {
    type ApplicationStatus, type ChatMessage, companionTarget, formatDay, formatMessageDate, idFromIri, type Terms,
} from "@/lib/messenger";
import type { CatalogOffer } from "@/lib/offersCatalog";
import { dayFromApi } from "@/lib/offerWizard";

import { type ApplicationLabels, ApplicationBlock } from "./ApplicationBlock";
import { type ChatInputLabels, ChatInput, type OutgoingMessage } from "./ChatInput";
import { type ChatListLabels, ChatList } from "./ChatList";
import { type CompanionLabels, type CompanionProfile, CompanionInfo } from "./CompanionInfo";
import { MessageBubble } from "./MessageBubble";
import { useChatList, useChatMessages, useLiveMessages } from "./useMessenger";

export interface MessengerLabels {
    title: string;
    choose: string;
    back: string;
    info: string;
    offerNotFound: string;
    applicationSent: string;
    sendError: string;
    error: string;
    close: string;
    list: ChatListLabels;
    input: ChatInputLabels;
    application: ApplicationLabels;
    companion: CompanionLabels;
}

export interface MessengerHrefs {
    /** Шаблоны с {id} */
    messenger: string;
    chat: string;
    offer: string;
    volunteer: string;
    organization: string;
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
    when?: { isFullYearAcceptable?: boolean; periods?: { start?: string | null; end?: string | null }[] | null } | null;
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
    const realChatId = chatId && !isCreate ? chatId : undefined;
    const recipientVolunteer = params.get("recipientVolunteer") ?? undefined;
    const recipientOrganization = params.get("recipientOrganization") ?? undefined;

    const list = useChatList(token, ready);
    const chat = useChatMessages(token, ready ? realChatId : undefined);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const fail = useCallback((text: string) => setToast({ text, ok: false }), []);

    const onLive = useCallback((message: ChatMessage) => {
        list.applyMessage(message);
        chat.addMessage(message);
    }, [chat, list]);
    const onPoll = useCallback(() => {
        void list.reload();
        void chat.refresh();
    }, [chat, list]);
    useLiveMessages(ready ? me?.id : undefined, onLive, onPoll);

    const href = (template: string, id: string | number) => template.replace("{id}", String(id));
    const open = useCallback((id?: number | string) => {
        router.push(id && String(id) !== chatId ? href(hrefs.chat, id) : hrefs.messenger);
    }, [chatId, hrefs.chat, hrefs.messenger, router]);

    // Собеседник: из чата или из адреса создания
    const [companion, setCompanion] = useState<CompanionProfile | null>(null);
    const [participant, setParticipant] = useState<{ id?: string | null; firstName?: string | null; lastName?: string | null; image?: unknown } | null>(null);
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
        /* eslint-enable react-hooks/set-state-in-effect */
        if (realChatId) {
            void browserApi(token).GET("/api/v1/chats/{id}", { params: { path: { id: realChatId } } }).then(({ data }) => {
                const other = data?.otherParticipants?.[0] ?? null;
                if (cancelled) return;
                setParticipant(other);
                void loadProfile(other?.id);
            }).catch(() => undefined);
        } else if (isCreate && recipientVolunteer) {
            void loadProfile(recipientVolunteer);
        }
        return () => {
            cancelled = true;
        };
    }, [ready, token, realChatId, isCreate, recipientVolunteer]);

    // Отклик на вакансию: вакансия и даты
    const [offer, setOffer] = useState<OfferFields | null>(null);
    const [terms, setTerms] = useState<Terms>({ start: null, end: null });
    const [applying, setApplying] = useState(false);
    useEffect(() => {
        if (!ready || !isCreate || !offerId) return;
        let cancelled = false;
        void browserApi(token)
            .GET("/api/v1/vacancies/{id}", { params: { path: { id: offerId } }, headers: { Accept: "application/json" } })
            .then(({ data }) => {
                if (cancelled) return;
                if (!data) {
                    fail(labels.offerNotFound);
                    return;
                }
                const loaded = data as OfferFields;
                setOffer(loaded);
                // Один период у вакансии — даты уже заданы организатором
                const periods = loaded.when && !loaded.when.isFullYearAcceptable ? loaded.when.periods ?? [] : [];
                const only = periods.length === 1 ? periods[0] : undefined;
                const start = dayFromApi(only?.start);
                const end = dayFromApi(only?.end);
                if (start && end) setTerms({ start, end });
            })
            .catch(() => fail(labels.offerNotFound));
        return () => {
            cancelled = true;
        };
    }, [ready, token, isCreate, offerId, fail, labels.offerNotFound]);
    const fixedDates = !!offer?.when && !offer.when.isFullYearAcceptable && offer.when.periods?.length === 1;

    const apply = async () => {
        if (!offerId || !terms.start || !terms.end) return;
        setApplying(true);
        setToast(null);
        const result = await browserApi(token)
            .POST("/api/v1/applications", {
                body: { vacancy: `/api/v1/vacancies/${offerId}`, startDate: terms.start, endDate: terms.end },
                headers: { Accept: "application/json" },
            })
            .catch(() => null);
        setApplying(false);
        const created = result?.data as { chat?: string | null } | undefined;
        if (!result?.response.ok || !created) {
            const error = (result?.error ?? null) as { detail?: string; title?: string } | null;
            fail(error?.detail || error?.title || labels.error);
            return;
        }
        reachGoal("application_sent");
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
            .then(() => list.markRead(Number(realChatId)))
            .catch(() => undefined);
    }, [chat.messages, realChatId, token, list]);

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

    const decide = async (applicationId: string, status: "accepted" | "canceled") => {
        const result = await browserApi(token)
            .PATCH("/api/v1/application_forms/{id}/status", {
                params: { path: { id: applicationId } },
                body: { status },
                headers: { "Content-Type": "application/merge-patch+json" },
            })
            .catch(() => null);
        if (!result?.response.ok) {
            fail(labels.error);
            return;
        }
        reachGoal(status === "accepted" ? "application_accepted" : "application_rejected", { from: "chat" });
        void list.reload();
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
            fail(labels.sendError);
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
    const [image, setImage] = useState<string | null>(null);

    const headerPerson = companion ?? participant;
    const companionName = fullName(headerPerson, labels.list.noName);
    const companionAvatar = mediaUrl((companion?.image ?? participant?.image) as never, "small");
    const target = companionTarget(companion ?? (participant?.id ? { id: participant.id } : null), !!me?.hostId);
    const companionHref = target ? href(target.kind === "organization" ? hrefs.organization : hrefs.volunteer, target.id) : undefined;
    const myName = fullName(me, labels.list.noName);
    const myAvatar = mediaUrl(me?.image as never, "small");

    // Переписка снизу вверх (column-reverse): свежие сообщения внизу. Дата-разделитель — как в старом
    // фронте: у первого встреченного (самого свежего) сообщения каждого дня, кроме сегодняшнего
    const rendered = useMemo(() => {
        const items: React.ReactNode[] = [];
        const todayKey = new Date().toDateString();
        let day = "";
        chat.messages.forEach((message) => {
            const authorId = idFromIri(message.author);
            const own = authorId === me?.id;
            const applicationId = idFromIri(message.applicationForm);
            const messageDay = new Date(message.createdAt ?? 0).toDateString();
            const dateLine = messageDay !== day && messageDay !== todayKey;
            if (dateLine) day = messageDay;
            if (applicationId) {
                const application = applications[applicationId];
                if (application) {
                    const host = application.volunteerId !== me?.id;
                    items.push(
                        <ApplicationBlock
                            key={message.id}
                            locale={locale}
                            offer={application.offer}
                            offerHref={href(hrefs.offer, application.offer.id)}
                            terms={application.terms}
                            sent
                            username={own ? myName : companionName}
                            onDecision={host && application.status === "new" ? (status) => void decide(application.id, status) : undefined}
                            labels={labels.application}
                        />,
                    );
                }
            } else {
                items.push(
                    <Fragment key={message.id}>
                        <MessageBubble
                            own={own}
                            name={own ? myName : companionName}
                            avatar={own ? myAvatar : companionAvatar}
                            profileHref={authorId ? href(hrefs.volunteer, authorId) : undefined}
                            text={message.text ?? ""}
                            attachment={message.attachments?.[0]}
                            date={formatMessageDate(locale, message.createdAt, labels.list.noDate)}
                            token={token}
                            onImage={setImage}
                        />
                        {/* column-reverse: разделитель идёт после сообщения в разметке, на экране — над ним */}
                        {dateLine && <div className="my-1.5 text-center text-[0.75rem] font-medium text-caption">{formatDay(locale, message.createdAt ?? "")}</div>}
                    </Fragment>,
                );
            }
        });
        return items;
        // decide и href — без состояния, пересоздаются при каждом рендере
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat.messages, applications, me?.id, myName, myAvatar, companionName, companionAvatar, locale, token, labels, hrefs]);

    const hasChat = !!chatId;
    const scroller = useRef<HTMLDivElement>(null);

    return (
        <div className="mx-[50px] mt-5 mb-[18px] flex h-[calc(100vh-200px)] min-h-[400px] flex-1 flex-col down-lg:mx-5 down-lg:mt-0 down-lg:h-[calc(100vh-110px)] down-xs:mx-0">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
            <h2 className="text-[1.5em] font-normal down-lg:hidden">{labels.title}</h2>
            <div className="mt-5 flex h-full min-h-0 flex-1 border border-accent-bg down-lg:mt-0">
                <ChatList
                    locale={locale}
                    chats={list.chats}
                    selectedId={realChatId}
                    chatHref={(id) => href(hrefs.chat, id)}
                    onOpen={open}
                    search={list.search}
                    onSearch={list.setSearch}
                    status={list.status}
                    onStatus={list.setStatus}
                    labels={labels.list}
                    className={hasChat ? "down-lg:hidden" : "down-lg:flex down-lg:max-w-none"}
                />
                {!hasChat ? (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-field text-caption down-lg:hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element -- значок пустого чата */}
                        <img src="/web/icons/messenger/chat.svg" alt="" className="h-12 w-12" />
                        <span>{labels.choose}</span>
                    </div>
                ) : (
                    <div className="relative flex h-full w-full bg-field">
                        <div className="flex h-full min-w-0 flex-1 flex-col">
                            <div className="grid grid-cols-[1fr_auto] items-center gap-2.5 bg-white p-4">
                                <div className="flex w-full items-center gap-2.5 overflow-hidden">
                                    <button type="button" aria-label={labels.back} onClick={() => open()} className="hidden cursor-pointer border-0 bg-transparent p-0 down-lg:flex">
                                        {/* eslint-disable-next-line @next/next/no-img-element -- стрелка назад */}
                                        <img src="/web/icons/messenger/arrow.svg" alt="" className="h-5 w-5" />
                                    </button>
                                    {companionHref
                                        ? <a href={companionHref} className="overflow-hidden text-[1.125rem] font-medium text-ellipsis whitespace-nowrap text-inherit no-underline">{companionName}</a>
                                        : <span className="overflow-hidden text-[1.125rem] font-medium text-ellipsis whitespace-nowrap">{isCreate && !recipientVolunteer ? "" : companionName}</span>}
                                </div>
                                {companion && (
                                    <button type="button" aria-label={labels.info} aria-expanded={infoOpen} onClick={() => setInfoOpen((value) => !value)} className="cursor-pointer border-0 bg-transparent p-[5px]">
                                        {/* eslint-disable-next-line @next/next/no-img-element -- стрелка панели */}
                                        <img src="/web/icons/messenger/accordion-arrow.svg" alt="" className={`h-5 w-5 transition-transform ${infoOpen ? "rotate-90" : "-rotate-90"}`} />
                                    </button>
                                )}
                            </div>
                            <div
                                ref={scroller}
                                className="flex h-full w-full flex-1 flex-col-reverse gap-1.5 overflow-auto px-4 py-5"
                                onScroll={(event) => {
                                    const box = event.currentTarget;
                                    // column-reverse: scrollTop отрицательный, верх — у -(scrollHeight - clientHeight)
                                    if (box.scrollHeight - box.clientHeight + box.scrollTop < 80) chat.loadMore();
                                }}
                            >
                                {isCreate && offerId && offer
                                    ? (
                                        <ApplicationBlock
                                            locale={locale}
                                            offer={toCatalogOffer(offer, dict.categories)}
                                            offerHref={href(hrefs.offer, offer.id ?? offerId)}
                                            terms={terms}
                                            onTerms={setTerms}
                                            sent={false}
                                            username={companionName}
                                            fixedDates={fixedDates}
                                            onSubmit={() => void apply()}
                                            busy={applying}
                                            labels={labels.application}
                                        />
                                    )
                                    : rendered}
                            </div>
                            <ChatInput
                                token={token}
                                disabled={!ready || (isCreate && !!offerId) || (isCreate && !recipientVolunteer && !recipientOrganization)}
                                labels={labels.input}
                                onSend={(message) => void send(message)}
                                onError={fail}
                            />
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
