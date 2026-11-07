"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { browserApi } from "@/lib/browserApi";
import { CHANNELS, type Channel, type NotificationState, TYPES, type NotificationType, toggleCell } from "@/lib/notificationSettings";

export interface NotificationSettingsLabels {
    intro: string;
    connectTitle: string;
    telegram: string;
    max: string;
    connect: string;
    connecting: string;
    connectHint: string;
    connected: string;
    disconnect: string;
    soon: string;
    unavailable: string;
    tableTitle: string;
    channels: Record<Channel, string>;
    types: Record<NotificationType, string>;
    hints: Record<NotificationType, string>;
    needConnect: string;
    service: string;
    quiet: string;
    saveError: string;
    loadError: string;
    retry: string;
}

/**
 * Кабинет организатора → «Уведомления» (документ «Уведомления организаторам в Telegram и MAX»):
 * подключение Telegram (MAX — «скоро») и таблица «что и куда присылать». Галочки сохраняются
 * сразу; канал мессенджера включается только после подключения.
 */
export function NotificationSettings({ labels }: { labels: NotificationSettingsLabels }) {
    const session = useSession();
    const [state, setState] = useState<NotificationState | null>(null);
    const [failed, setFailed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [waiting, setWaiting] = useState(false);
    const poll = useRef<ReturnType<typeof setInterval> | null>(null);

    const load = useCallback(async () => {
        const { data } = await browserApi(session.token).GET("/api/v1/notification-settings");
        if (!data) throw new Error("load");
        setState(data as NotificationState);
        return data as NotificationState;
    }, [session.token]);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        browserApi(session.token)
            .GET("/api/v1/notification-settings")
            .then(({ data }) => {
                if (cancelled) return;
                if (data) setState(data as NotificationState);
                else setFailed(true);
            })
            .catch(() => !cancelled && setFailed(true));
        return () => {
            cancelled = true;
            if (poll.current) clearInterval(poll.current);
        };
    }, [session.status, session.token]);

    const toggle = async (type: NotificationType, channel: Channel, enabled: boolean) => {
        if (!state) return;
        const previous = state;
        setState(toggleCell(state, type, channel, enabled));
        setError(null);
        const { data } = await browserApi(session.token)
            .PATCH("/api/v1/notification-settings", { body: { type, channel, enabled, wording: type === "news" ? labels.types.news : null } })
            .catch(() => ({ data: undefined }));
        if (data) setState(data as NotificationState);
        else {
            setState(previous);
            setError(labels.saveError);
        }
    };

    const connect = async () => {
        // Окно открываем сразу по нажатию — иначе браузер сочтёт его всплывающим и заблокирует
        const tab = window.open("about:blank", "_blank");
        const { data } = await browserApi(session.token).POST("/api/v1/notification-settings/telegram/link").catch(() => ({ data: undefined }));
        if (!data) {
            tab?.close();
            setError(labels.saveError);
            return;
        }
        if (tab) tab.location.href = data.url;
        else window.location.href = data.url;
        // Ждём «Старт» в боте: проверяем раз в 3 секунды до 3 минут
        setWaiting(true);
        let rounds = 0;
        if (poll.current) clearInterval(poll.current);
        poll.current = setInterval(() => {
            rounds += 1;
            load().then((next) => {
                if (next.channels.telegram.connected || rounds > 60) {
                    if (poll.current) clearInterval(poll.current);
                    setWaiting(false);
                }
            }).catch(() => undefined);
        }, 3000);
    };

    const disconnect = async () => {
        const { data } = await browserApi(session.token).DELETE("/api/v1/notification-settings/telegram").catch(() => ({ data: undefined }));
        if (data) setState(data as NotificationState);
        else setError(labels.saveError);
    };

    if (failed && !state) {
        return (
            <p role="alert" className="mt-6 text-[15px] text-error">
                {labels.loadError}{" "}
                <button type="button" onClick={() => { setFailed(false); load().catch(() => setFailed(true)); }} className="cursor-pointer text-primary underline">{labels.retry}</button>
            </p>
        );
    }
    if (!state) return <Loading className="min-h-[300px]" />;

    const telegram = state.channels.telegram;
    return (
        <div className="mt-4 flex max-w-[760px] flex-col gap-8">
            <p className="text-[16px] leading-[140%]">{labels.intro}</p>

            <section aria-labelledby="connect-title" className="flex flex-col gap-3">
                <h3 id="connect-title" className="text-[18px] font-medium">{labels.connectTitle}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[10px] border border-accent-bg px-5 py-4">
                    <span className="min-w-[90px] font-medium">{labels.telegram}</span>
                    {!telegram.available ? (
                        <span className="text-[14px] text-caption">{labels.unavailable}</span>
                    ) : telegram.connected ? (
                        <>
                            <span className="text-[15px]" role="status">✅ {labels.connected}{telegram.username ? ` · @${telegram.username}` : ""}</span>
                            <button type="button" onClick={() => void disconnect()} className="cursor-pointer text-[14px] text-primary hover:underline">{labels.disconnect}</button>
                        </>
                    ) : (
                        <>
                            <button type="button" onClick={() => void connect()} className="cursor-pointer rounded-[10px] border border-primary bg-primary px-5 py-2.5 text-[15px] text-white transition-colors hover:bg-white hover:text-primary">
                                {waiting ? labels.connecting : labels.connect}
                            </button>
                            {waiting && <span className="text-[14px] text-caption" role="status">{labels.connectHint}</span>}
                        </>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[10px] border border-accent-bg px-5 py-4 opacity-70">
                    <span className="min-w-[90px] font-medium">{labels.max}</span>
                    <span className="text-[14px] text-caption">{labels.soon}</span>
                </div>
            </section>

            <section aria-labelledby="table-title" className="flex flex-col gap-3">
                <h3 id="table-title" className="text-[18px] font-medium">{labels.tableTitle}</h3>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] border-collapse text-left text-[15px] down-sm:min-w-0">
                        <thead>
                            <tr className="border-b border-accent-bg text-[14px] text-caption">
                                <th scope="col" className="py-2 pr-4 font-normal" />
                                {/* MAX пока «скоро» — на узком экране его колонку не показываем, чтобы таблица помещалась */}
                                {CHANNELS.map((channel) => <th key={channel} scope="col" className={`px-2 py-2 text-center font-normal ${channel === "max" ? "down-sm:hidden" : ""}`}>{labels.channels[channel]}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {TYPES.map((type) => (
                                <tr key={type} className="border-b border-accent-bg">
                                    <th scope="row" className="py-3 pr-4 text-left font-normal">
                                        {labels.types[type]}
                                        <span className="mt-0.5 block text-[13px] text-caption">{labels.hints[type]}</span>
                                    </th>
                                    {CHANNELS.map((channel) => {
                                        const value = state.matrix[type]?.[channel];
                                        if (value === null || value === undefined) {
                                            return <td key={channel} className={`px-2 py-3 text-center text-caption ${channel === "max" ? "down-sm:hidden" : ""}`} aria-label="—">—</td>;
                                        }
                                        const locked = (channel === "telegram" && !telegram.connected) || channel === "max";
                                        return (
                                            <td key={channel} className={`px-2 py-3 text-center ${channel === "max" ? "down-sm:hidden" : ""}`}>
                                                <input
                                                    type="checkbox"
                                                    aria-label={`${labels.types[type]}: ${labels.channels[channel]}`}
                                                    title={locked ? labels.needConnect : undefined}
                                                    checked={value && !locked}
                                                    disabled={locked}
                                                    onChange={(event) => void toggle(type, channel, event.target.checked)}
                                                    className="h-[18px] w-[18px] cursor-pointer accent-primary disabled:cursor-default"
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {error && <p role="alert" className="text-[14px] text-error">{error}</p>}
                <p className="text-[13px] leading-[140%] text-caption">{labels.service} {labels.quiet}</p>
            </section>
        </div>
    );
}
