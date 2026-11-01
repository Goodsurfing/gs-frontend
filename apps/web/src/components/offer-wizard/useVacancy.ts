"use client";

import type { components, paths } from "@goodsurfing/api";
import { useCallback, useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

/** Вакансия, как её отдаёт GET /api/v1/vacancies/{id} */
export type Vacancy = paths["/api/v1/vacancies/{id}"]["get"]["responses"][200]["content"]["application/json"];
export type VacancyPatch = components["schemas"]["Vacancy-vacancy.write.jsonMergePatch"];

export type VacancyState =
    | { status: "loading" }
    | { status: "missing" }
    | { status: "ready"; vacancy: Vacancy };

/** Текст ошибки API (getErrorText старого фронта): detail, title, список errors, message */
export function apiErrorText(error: unknown, fallback: string): string {
    if (!error || typeof error !== "object") return fallback;
    const data = error as Record<string, unknown>;
    if (typeof data.detail === "string" && data.detail) return data.detail;
    if (typeof data.title === "string" && data.title) return data.title;
    if (Array.isArray(data.errors) && data.errors.length) return data.errors.join(". ");
    if (typeof data.error === "string" && data.error) return data.error;
    if (typeof data.message === "string" && data.message) return data.message;
    return fallback;
}

/**
 * Вакансия для шага мастера: читается и сохраняется в браузере с токеном
 * вошедшего (данные кабинета не кэшируются на сервере). Сохранение — PATCH
 * /api/v1/vacancies/{id} в формате merge-patch, как в старом фронте; вернёт
 * текст ошибки или null.
 */
export function useVacancy(id: string) {
    const session = useSession();
    const [state, setState] = useState<VacancyState>({ status: "loading" });

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token)
            .GET("/api/v1/vacancies/{id}", { params: { path: { id } }, headers: { Accept: "application/json" } })
            .then(({ data }) => {
                if (!cancelled) setState(data ? { status: "ready", vacancy: data } : { status: "missing" });
            })
            .catch(() => {
                if (!cancelled) setState({ status: "missing" });
            });
        return () => {
            cancelled = true;
        };
    }, [id, session.status, session.token]);

    const save = useCallback(async (patch: VacancyPatch, fallbackError: string): Promise<string | null> => {
        const result = await browserApi(session.token)
            .PATCH("/api/v1/vacancies/{id}", {
                params: { path: { id } },
                body: patch,
                headers: { "Content-Type": "application/merge-patch+json", Accept: "application/json" },
            })
            .catch(() => null);
        if (!result) return fallbackError;
        // Формы держат своё состояние — после сохранения вакансию не перечитываем
        if (result.error || !result.data) return apiErrorText(result.error, fallbackError);
        return null;
    }, [id, session.token]);

    return { state, save };
}
