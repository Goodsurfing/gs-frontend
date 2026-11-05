import { Avatar } from "@/components/ui/Avatar";
import type { Locale } from "@/i18n/config";
import { eventAction, type EventFeedLabels, type FeedEventView, holdersText, MIN_EVENTS, relativeTime } from "@/lib/eventFeed";
import { routes } from "@/lib/routes";

import { EventFeedStrip } from "./EventFeedStrip";

const href = (locale: Locale, event: FeedEventView): string => {
    switch (event.targetKind) {
        case "volunteer": return routes.volunteerPublic(locale, event.targetId);
        case "organization": return routes.organization(locale, event.targetId);
        case "blog": return routes.blogArticle(locale, event.targetId);
        default: return routes.offer(locale, event.targetId);
    }
};

function Stars({ rating }: { rating: number }) {
    return (
        <span aria-label={`${rating}/5`} className="flex gap-0.5 text-[22px] leading-none">
            {[1, 2, 3, 4, 5].map((star) => <span key={star} aria-hidden className={star <= rating ? "text-[#ffc400]" : "text-accent-bg"}>★</span>)}
        </span>
    );
}

/** Картинка события: значок целиком, обложка вакансии или статьи — по ширине; место зарезервировано */
function Visual({ event }: { event: FeedEventView }) {
    if (event.type === "review") return <div className="flex h-[96px] items-center justify-center"><Stars rating={event.rating ?? 5} /></div>;
    if (event.type === "member") {
        return (
            <div className="flex h-[96px] items-center justify-center">
                <span className={`flex h-[72px] w-[72px] items-center justify-center rounded-full text-white ${event.membership === "international" ? "bg-cta" : "bg-primary"}`}>
                    <svg aria-hidden viewBox="0 0 24 24" className="h-9 w-9" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21Z" /></svg>
                </span>
            </div>
        );
    }
    if (!event.image) return <div className="h-[96px] rounded-[10px] bg-field" />;
    if (event.type === "badge") {
        // eslint-disable-next-line @next/next/no-img-element -- картинка значка из хранилища
        return <div className="flex h-[96px] items-center justify-center"><img src={event.image} alt="" width={88} height={88} loading="lazy" decoding="async" className="h-[88px] w-[88px] object-contain" /></div>;
    }
    // eslint-disable-next-line @next/next/no-img-element -- превью из хранилища
    return <img src={event.image} alt="" width={206} height={96} loading="lazy" decoding="async" className="h-[96px] w-full rounded-[10px] bg-field object-cover" />;
}

/**
 * «Лента событий Гудсёрфинга» на главной (GS-241, по образцу DonorSearch):
 * кто получил значок, кто едет в проект, кто вступил в сообщество, новые
 * вакансии, отзывы и статьи. Меньше трёх событий — блока нет.
 */
export function EventFeed({ locale, events, title, labels, prevLabel, nextLabel }: {
    locale: Locale;
    events: FeedEventView[];
    title: string;
    labels: EventFeedLabels;
    prevLabel: string;
    nextLabel: string;
}) {
    if (events.length < MIN_EVENTS) return null;
    const now = new Date();
    return (
        <section className="pt-20" aria-labelledby="event-feed-title">
            <div className="mx-auto w-[1180px] max-[1180px]:w-[992px] down-lg:w-[768px] down-md:w-full">
                <h2 id="event-feed-title" className="text-center text-[1.625rem] leading-[123%] font-normal text-ink-secondary">{title}</h2>
                <EventFeedStrip prevLabel={prevLabel} nextLabel={nextLabel}>
                    {events.map((event) => (
                        <li key={`${event.type}-${event.targetKind}-${event.targetId}-${event.at}`} className="w-[238px] shrink-0 snap-start">
                            <a href={href(locale, event)} className="flex h-full flex-col gap-3 rounded-[14px] border border-accent-bg bg-white p-4 text-inherit no-underline shadow-[0_2px_10px_rgba(14,29,39,0.06)] transition-shadow hover:shadow-[0_6px_18px_rgba(14,29,39,0.12)]">
                                {event.personName ? (
                                    <div className="flex min-h-[44px] items-center gap-3">
                                        <Avatar src={event.personAvatar ?? undefined} name={event.personName} size={44} />
                                        <div className="flex min-w-0 flex-col">
                                            <span className="line-clamp-2 text-[14px] leading-[130%] font-semibold text-ink">{event.personName}</span>
                                            {event.personPlace && <span className="truncate text-[12px] text-caption">{event.personPlace}</span>}
                                        </div>
                                    </div>
                                ) : <div className="min-h-[44px] text-[12px] font-semibold tracking-wide text-caption uppercase">{eventAction(event, labels)}</div>}
                                <Visual event={event} />
                                <div className="mt-auto flex flex-col gap-1">
                                    {event.personName && <span className="text-[12px] text-caption">{eventAction(event, labels)}</span>}
                                    {event.type !== "member" && <span className="line-clamp-2 text-[14px] leading-[135%] font-semibold text-ink-secondary">{event.title}</span>}
                                    <span className="flex justify-between gap-2 text-[12px] text-caption">
                                        <span>{relativeTime(locale, event.at, now)}</span>
                                        {event.type === "badge" && event.holders ? <span>{holdersText(labels.holders, event.holders)}</span> : null}
                                    </span>
                                </div>
                            </a>
                        </li>
                    ))}
                </EventFeedStrip>
            </div>
        </section>
    );
}
