"use client";

import { useCallback, useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

export type BlockedUser = { id: string; firstName: string; lastName: string; avatar: string | null; blockedAt: string };

/**
 * Кого вошедший заблокировал (GS-282): список, «Заблокировать», «Разблокировать».
 * Список небольшой (до 200) — грузится целиком, один раз на страницу.
 */
export function useBlocks(enabled = true) {
    const session = useSession();
    const token = session.token;
    const active = enabled && session.status === "user";
    const [items, setItems] = useState<BlockedUser[] | null>(null);
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!active) return;
        let cancelled = false;
        void browserApi(token).GET("/api/v1/blocks")
            .then(({ data }) => {
                if (cancelled) return;
                if (!data) throw new Error("blocks");
                setItems((data.items ?? []) as BlockedUser[]);
                setFailed(false);
            })
            .catch(() => !cancelled && setFailed(true));
        return () => {
            cancelled = true;
        };
    }, [active, token, attempt]);

    const block = useCallback(async (userId: string) => {
        const { response } = await browserApi(token).POST("/api/v1/blocks", { body: { userId } });
        if (!response.ok) return false;
        setAttempt((n) => n + 1);
        return true;
    }, [token]);

    const unblock = useCallback(async (userId: string) => {
        const { response } = await browserApi(token).DELETE("/api/v1/blocks/{userId}", { params: { path: { userId } } });
        if (!response.ok) return false;
        setItems((prev) => prev?.filter((item) => item.id !== userId) ?? prev);
        return true;
    }, [token]);

    const isBlocked = useCallback((userId: string | null | undefined) => !!userId && !!items?.some((item) => item.id === userId), [items]);

    return { items, failed, retry: () => setAttempt((n) => n + 1), block, unblock, isBlocked };
}
