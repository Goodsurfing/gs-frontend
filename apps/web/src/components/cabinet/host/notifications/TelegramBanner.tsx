"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

const HIDDEN_KEY = "gs.telegramBannerHidden";

/**
 * Баннер в кабинете организатора: «Получайте заявки в Telegram — ответите быстрее».
 * Только если бот есть и Telegram ещё не подключён; «Скрыть» запоминается в браузере.
 */
export function TelegramBanner({ href, labels }: { href: string; labels: { text: string; button: string; close: string } }) {
    const session = useSession();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (session.status !== "user") return;
        try {
            if (localStorage.getItem(HIDDEN_KEY)) return;
        } catch {
            return;
        }
        let cancelled = false;
        browserApi(session.token)
            .GET("/api/v1/notification-settings")
            .then(({ data }) => {
                if (!cancelled && data?.channels.telegram.available && !data.channels.telegram.connected) setShow(true);
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token]);

    if (!show) return null;
    return (
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[10px] bg-accent-bg px-5 py-3.5" role="note">
            <span className="text-[15px]">📩 {labels.text}</span>
            <a href={href} className="rounded-[10px] bg-primary px-4 py-2 text-[14px] text-white no-underline hover:bg-primary-hover">{labels.button}</a>
            <button
                type="button"
                onClick={() => {
                    try {
                        localStorage.setItem(HIDDEN_KEY, "1");
                    } catch {
                        // нет хранилища — просто скрыть
                    }
                    setShow(false);
                }}
                className="ml-auto cursor-pointer text-[14px] text-caption hover:text-ink"
            >
                {labels.close}
            </button>
        </div>
    );
}
