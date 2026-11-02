"use client";

import { useCallback, useState } from "react";

import { reachGoal } from "@/components/analytics/YandexMetrika";
import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

import type { ApplicationStatus } from "./ApplicationCard";

/**
 * Смена статуса заявки (PATCH application_forms/{id}/status, merge-patch):
 * без подтверждения, как в старом; цели Метрики — при принятии и отклонении.
 * Ошибка — сообщение в error, после успеха — onDone (перезапрос списков).
 */
export function useApplicationStatus(onDone: () => void, errorText: string) {
    const session = useSession();
    const [error, setError] = useState<string | null>(null);
    const change = useCallback(async (id: number, status: ApplicationStatus) => {
        const { error: failed } = await browserApi(session.token).PATCH("/api/v1/application_forms/{id}/status", {
            params: { path: { id: String(id) } },
            body: { status } as never,
            headers: { "Content-Type": "application/merge-patch+json" },
        }).catch(() => ({ error: true }));
        if (failed) {
            setError(errorText);
            return;
        }
        if (status === "accepted") reachGoal("application_accepted", { from: "requests" });
        if (status === "canceled") reachGoal("application_rejected", { from: "requests" });
        onDone();
    }, [session.token, onDone, errorText]);
    return { change, error, clearError: useCallback(() => setError(null), []) };
}
