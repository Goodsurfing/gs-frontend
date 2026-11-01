"use client";

import type { components } from "@goodsurfing/api";
import { useCallback, useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

export type MyOrganization = components["schemas"]["Organization-organization.read_user.member_media_object.read"];
type OrganizationPatch = components["schemas"]["Organization-organization.write.jsonMergePatch"];

/**
 * Своя организация (GET /personal/organization) и её правка merge-patch.
 * isActive не отправляется: в типе оно обязательное (default false), а
 * merge-patch оставляет неуказанные поля как есть.
 */
export function useMyOrganization() {
    const session = useSession();
    const [organization, setOrganization] = useState<MyOrganization | null>(null);
    const [failed, setFailed] = useState(false);

    const load = useCallback(async () => {
        const { data } = await browserApi(session.token).GET("/api/v1/personal/organization").catch(() => ({ data: undefined }));
        if (data?.id) setOrganization(data);
        else setFailed(true);
    }, [session.token]);

    useEffect(() => {
        // Данные организации — после того, как сессия узнала вошедшего
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (session.status === "user") void load();
    }, [session.status, load]);

    const id = organization?.id;
    /** Записать поля; true — сервер принял (организация перечитывается) */
    const save = useCallback(async (patch: Omit<OrganizationPatch, "isActive">) => {
        if (!id) return false;
        const { error } = await browserApi(session.token).PATCH("/api/v1/organizations/{id}", {
            params: { path: { id } },
            body: patch as never,
            headers: { "Content-Type": "application/merge-patch+json" },
        }).catch(() => ({ error: true }));
        if (error) return false;
        await load();
        return true;
    }, [id, session.token, load]);

    return { organization, failed, save, token: session.token };
}

/** IRI картинки для записи: в ответе id без префикса */
export const mediaIri = (id: string) => `/api/v1/media_objects/${id}`;
