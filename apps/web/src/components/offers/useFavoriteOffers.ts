"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useOptionalSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

/**
 * Избранные вакансии вошедшего (useFavoriteOffers старого фронта, gs-backend
 * #407): номера избранных и переключение сердечка. Гостю — enabled: false,
 * без запросов.
 *
 * Сердечко меняется сразу: локальная отметка перекрывает номера с сервера,
 * при ошибке отметка возвращается к снимку до нажатия. Пока запрос по
 * вакансии идёт, повторные нажатия по ней игнорируются (busy). Пришедшие
 * номера не затирают вакансии с запросом в полёте.
 *
 * assumeFavorite — для списка избранного: пока номера не загружены, каждая
 * вакансия считается избранной (иначе сердца были бы белыми).
 */
export function useFavoriteOffers({ assumeFavorite = false }: { assumeFavorite?: boolean } = {}) {
    const session = useOptionalSession();
    const enabled = session?.status === "user";
    const token = session?.token;
    /** Номера с сервера; null — ещё не загружены (или не ответил) */
    const [serverIds, setServerIds] = useState<Set<number> | null>(null);
    /** Отметки, поставленные здесь: перекрывают серверные */
    const [local, setLocal] = useState<Map<number, boolean>>(() => new Map());
    /** Вакансии с запросом в полёте: ref — для защиты, state — для отрисовки */
    const pendingRef = useRef<Set<number>>(new Set());
    const [pending, setPending] = useState<Set<number>>(() => new Set());

    useEffect(() => {
        if (!enabled) return;
        let cancelled = false;
        void browserApi(token).GET("/api/v1/favorites/vacancies/ids")
            .then(({ data, response }) => {
                if (cancelled || !response.ok) return;
                setServerIds(new Set(data?.ids ?? []));
                // Сервер теперь источник правды — кроме вакансий, по которым запрос ещё идёт
                setLocal((prev) => new Map([...prev].filter(([id]) => pendingRef.current.has(id))));
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [enabled, token]);

    const isFavorite = useCallback((id: number) => {
        const own = local.get(id);
        if (own !== undefined) return own;
        return serverIds ? serverIds.has(id) : assumeFavorite;
    }, [local, serverIds, assumeFavorite]);

    const isBusy = useCallback((id: number) => pending.has(id), [pending]);

    /** Переключить; вернуть true, если сервер принял (повторное нажатие во время запроса — false) */
    const toggleFavorite = useCallback(async (id: number) => {
        if (pendingRef.current.has(id)) return false;
        const markPending = (on: boolean) => {
            if (on) pendingRef.current.add(id);
            else pendingRef.current.delete(id);
            setPending(new Set(pendingRef.current));
        };
        const adding = !isFavorite(id);
        const hadOwn = local.has(id);
        const ownBefore = local.get(id);
        markPending(true);
        setLocal((prev) => new Map(prev).set(id, adding));
        const options = { params: { path: { id: String(id) } } };
        const api = browserApi(token);
        // openapi-fetch при ответе не 2xx с пустым телом даёт error: undefined — смотрим на статус
        const ok = await (adding
            ? api.POST("/api/v1/favorites/vacancies/{id}", options)
            : api.DELETE("/api/v1/favorites/vacancies/{id}", options))
            .then(({ response }) => response.ok, () => false);
        if (!ok) {
            setLocal((prev) => {
                const next = new Map(prev);
                if (hadOwn && ownBefore !== undefined) next.set(id, ownBefore);
                else next.delete(id);
                return next;
            });
        }
        markPending(false);
        return ok;
    }, [isFavorite, local, token]);

    return { enabled, isFavorite, isBusy, toggleFavorite };
}
