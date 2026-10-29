"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

/**
 * «Редактировать профиль» (своя организация) или «Написать» (вошедшему, когда
 * узнали, есть ли уже переписка с владельцем: есть — в неё, нет — в новую).
 * Гостю кнопок нет — как в старом фронте.
 */
export function OrganizationActions({ ownerId, hrefs, labels, className = "" }: {
    ownerId: string | undefined;
    hrefs: { edit: string; messenger: string };
    labels: { edit: string; write: string };
    className?: string;
}) {
    const session = useSession();
    const [chatHref, setChatHref] = useState<string | null>(null);
    const isOwner = session.status === "user" && !!ownerId && session.profile?.id === ownerId;

    useEffect(() => {
        if (session.status !== "user" || !ownerId || session.profile?.id === ownerId) return;
        let cancelled = false;
        void browserApi(session.token)
            .GET("/api/v1/personal/chats", { params: { query: { participantId: ownerId } } })
            .then(({ data }) => {
                if (cancelled) return;
                const first = (Array.isArray(data) ? data : [])[0] as { id?: number | string } | undefined;
                setChatHref(first?.id !== undefined
                    ? `${hrefs.messenger}/${first.id}`
                    : `${hrefs.messenger}/create?${new URLSearchParams({ recipientVolunteer: ownerId })}`);
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [session.status, session.profile, session.token, ownerId, hrefs.messenger]);

    const button = `flex w-full items-center justify-center rounded-[10px] border border-primary px-[50px] py-2.5 text-[16px] leading-[120%] transition-all duration-300 ${className}`;
    if (isOwner) {
        return <a href={hrefs.edit} className={`${button} bg-white text-primary hover:bg-primary hover:text-white`}>{labels.edit}</a>;
    }
    if (session.status === "user" && chatHref) {
        return <a href={chatHref} className={`${button} bg-primary text-white hover:bg-white hover:text-primary`}>{labels.write}</a>;
    }
    return null;
}
