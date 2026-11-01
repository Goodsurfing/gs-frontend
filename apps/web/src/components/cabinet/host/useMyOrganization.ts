"use client";

import type { components } from "@goodsurfing/api";
import { useCallback, useEffect, useRef, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

export type MyOrganization = components["schemas"]["Organization-organization.read_user.member_media_object.read"];
type OrganizationPatch = Omit<components["schemas"]["Organization-organization.write.jsonMergePatch"], "isActive">;

/**
 * Своя организация (GET /personal/organization) и её правка merge-patch.
 * isActive не отправляется: в типе оно обязательное (default false), а
 * merge-patch оставляет неуказанные поля как есть.
 *
 * Правки идут по очереди, а функция-патч получает последнюю версию
 * организации: два одновременных изменения галереи не затирают друг друга.
 */
export function useMyOrganization() {
    const session = useSession();
    const [organization, setOrganization] = useState<MyOrganization | null>(null);
    const [failed, setFailed] = useState(false);
    const latest = useRef<MyOrganization | null>(null);
    const queue = useRef<Promise<unknown>>(Promise.resolve());

    const load = useCallback(async () => {
        const { data } = await browserApi(session.token).GET("/api/v1/personal/organization").catch(() => ({ data: undefined }));
        if (data?.id) {
            latest.current = data;
            setOrganization(data);
        } else {
            setFailed(true);
        }
    }, [session.token]);

    useEffect(() => {
        // Данные организации — после того, как сессия узнала вошедшего
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (session.status === "user") void load();
    }, [session.status, load]);

    /** Записать поля; true — сервер принял (организация перечитывается) */
    const save = useCallback((patch: OrganizationPatch | ((current: MyOrganization) => OrganizationPatch)) => {
        const run = async () => {
            const current = latest.current;
            if (!current?.id) return false;
            const { error } = await browserApi(session.token).PATCH("/api/v1/organizations/{id}", {
                params: { path: { id: current.id } },
                body: (typeof patch === "function" ? patch(current) : patch) as never,
                headers: { "Content-Type": "application/merge-patch+json" },
            }).catch(() => ({ error: true }));
            if (error) return false;
            await load();
            return true;
        };
        const next = queue.current.then(run, run);
        queue.current = next.catch(() => undefined);
        return next;
    }, [session.token, load]);

    /** Последняя загруженная версия — для решений вне рендера (сколько ещё мест в галерее) */
    const current = useCallback(() => latest.current, []);

    return { organization, failed, save, current, token: session.token };
}

/** IRI картинки для записи: в ответе id без префикса */
export const mediaIri = (id: string) => `/api/v1/media_objects/${id}`;

/** IRI фото галереи организации */
export const galleryIris = (organization: MyOrganization) => (organization.galleryImages ?? []).flatMap((image) => (image.id ? [mediaIri(image.id)] : []));
