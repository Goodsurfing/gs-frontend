"use client";

import type { components, paths } from "@goodsurfing/api";
import { useCallback, useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";
import { errorMessage } from "@/lib/offerWizardFinish";

/** Вакансия, как её отдаёт GET /api/v1/vacancies/{id} */
export type Vacancy = paths["/api/v1/vacancies/{id}"]["get"]["responses"][200]["content"]["application/json"];
export type VacancyPatch = components["schemas"]["Vacancy-vacancy.write.jsonMergePatch"];

export type VacancyState =
    | { status: "loading" }
    | { status: "missing" }
    | { status: "ready"; vacancy: Vacancy };

/** Текст ошибки API (getErrorText старого фронта) или запасной */
export const apiErrorText = (error: unknown, fallback: string): string => errorMessage(error) ?? fallback;

/** PATCH /api/v1/vacancies/{id} в формате merge-patch (как updateOffer старого фронта); сеть недоступна — null */
export const patchVacancy = (token: string | undefined, id: string, patch: VacancyPatch) => browserApi(token)
    .PATCH("/api/v1/vacancies/{id}", {
        params: { path: { id } },
        body: patch,
        headers: { "Content-Type": "application/merge-patch+json", Accept: "application/json" },
    })
    .catch(() => null);

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
        const result = await patchVacancy(session.token, id, patch);
        if (!result) return fallbackError;
        // Формы держат своё состояние — после сохранения вакансию не перечитываем
        if (result.error || !result.response.ok) return apiErrorText(result.error, fallbackError);
        return null;
    }, [id, session.token]);

    return { state, save };
}

/** Вакансия в виде GET /api/v1/vacancy/{id}: только тут категории описания приходят целиком (в /vacancies/{id} — пустые) */
export type VacancyElement = paths["/api/v1/vacancy/{id}"]["get"]["responses"][200]["content"]["application/json"];

export type VacancyElementState =
    | { status: "loading" }
    | { status: "missing" }
    | { status: "ready"; vacancy: VacancyElement };

/** То же для шага «Описание»: GET /api/v1/vacancy/{id}, как OfferDescription старого фронта */
export function useVacancyElement(id: string): VacancyElementState {
    const session = useSession();
    const [state, setState] = useState<VacancyElementState>({ status: "loading" });
    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token)
            .GET("/api/v1/vacancy/{id}", { params: { path: { id: Number(id) } } })
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
    return state;
}

/** Пункт справочника: навык, жильё, питание, проезд */
export type DictionaryItem = components["schemas"]["ListResult17"];

type DictionaryPath = "/api/v1/skill" | "/api/v1/house" | "/api/v1/food" | "/api/v1/transfer";

/** Справочник на языке страницы (useGetPublicSkillsQuery и др. старого фронта); без входа API его не отдаёт */
export function useDictionary(path: DictionaryPath, locale: Locale): DictionaryItem[] | null {
    const session = useSession();
    const [items, setItems] = useState<DictionaryItem[] | null>(null);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token)
            .GET(path, { params: { query: { lang: locale } } })
            .then(({ data }) => {
                if (!cancelled) setItems(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!cancelled) setItems([]);
            });
        return () => {
            cancelled = true;
        };
    }, [path, locale, session.status, session.token]);

    return items;
}
