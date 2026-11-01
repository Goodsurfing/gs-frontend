"use client";

import type { components } from "@goodsurfing/api";
import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";

export type VacancyElement = components["schemas"]["ElementResult8"];
/** Пункт справочника: навык, жильё, питание, проезд */
export type DictionaryItem = components["schemas"]["ListResult17"];

export type ElementState =
    | { status: "loading" }
    | { status: "missing" }
    | { status: "ready"; vacancy: VacancyElement };

/**
 * Вакансия для шагов «Что делать», «Условия», «Последние штрихи»:
 * GET /api/v1/vacancy/{id} (как в старом фронте) — в нём блоки уже со
 * справочными id и статус вакансии. Читается в браузере с токеном вошедшего.
 */
export function useVacancyElement(id: string) {
    const session = useSession();
    const [state, setState] = useState<ElementState>({ status: "loading" });

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

    return { state, token: session.token };
}

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
