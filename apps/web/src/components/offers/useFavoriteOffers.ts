"use client";

import { useCallback, useEffect, useState } from "react";

import { useOptionalSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

/**
 * Избранные вакансии вошедшего (useFavoriteOffers старого фронта, gs-backend
 * #407): номера избранных и переключение сердечка. Гостю — enabled: false,
 * без запросов. Сердечко меняется сразу, при ошибке — откат.
 */
export function useFavoriteOffers() {
    const session = useOptionalSession();
    const enabled = session?.status === "user";
    const token = session?.token;
    const [ids, setIds] = useState<Set<number>>(() => new Set());

    useEffect(() => {
        if (!enabled) return;
        let cancelled = false;
        void browserApi(token).GET("/api/v1/favorites/vacancies/ids")
            .then(({ data }) => !cancelled && setIds(new Set(data?.ids ?? [])))
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [enabled, token]);

    const isFavorite = useCallback((id: number) => ids.has(id), [ids]);

    /** Переключить; вернуть true, если запрос прошёл */
    const toggleFavorite = useCallback(async (id: number) => {
        const adding = !ids.has(id);
        const flip = (add: boolean) => setIds((prev) => {
            const next = new Set(prev);
            if (add) next.add(id);
            else next.delete(id);
            return next;
        });
        flip(adding);
        const options = { params: { path: { id: String(id) } } };
        const api = browserApi(token);
        const { error } = await (adding
            ? api.POST("/api/v1/favorites/vacancies/{id}", options)
            : api.DELETE("/api/v1/favorites/vacancies/{id}", options)).catch(() => ({ error: true }));
        if (error) flip(!adding);
        return !error;
    }, [ids, token]);

    return { enabled, isFavorite, toggleFavorite };
}
