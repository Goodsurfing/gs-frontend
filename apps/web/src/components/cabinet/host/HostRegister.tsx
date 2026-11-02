"use client";

import { useEffect } from "react";

import { useSession } from "@/components/session/SessionProvider";

import { type HostDescriptionLabels, HostDescriptionForm } from "./HostDescriptionForm";

/**
 * Создание организации (HostRegisterPage старого фронта): у кого организация
 * уже есть — сразу на её описание; после создания — туда же через 2 с,
 * чтобы успело показаться сообщение.
 */
export function HostRegister({ infoHref, organizationHref, labels }: { infoHref: string; organizationHref: string; labels: HostDescriptionLabels }) {
    const session = useSession();
    const hostId = (session.profile as { hostId?: string | null } | null)?.hostId;
    useEffect(() => {
        if (hostId) window.location.replace(infoHref);
    }, [hostId, infoHref]);
    if (hostId) return null;
    return (
        <HostDescriptionForm
            organizationHref={organizationHref}
            infoHref={infoHref}
            labels={labels}
            onCreated={() => setTimeout(() => window.location.assign(infoHref), 2000)}
        />
    );
}
