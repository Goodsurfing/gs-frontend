"use client";

import { useCallback, useMemo } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { API_URL } from "@/lib/browserApi";

/** Ответ списка API админки (/admin/v1/…): данные и счётчики страниц */
export interface AdminPage<T> {
    data: T[];
    pagination?: { page: number; limit: number; total: number };
}

export class AdminApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "AdminApiError";
    }
}

export type AdminQuery = Record<string, string | number | boolean | undefined | null>;

const queryString = (query?: AdminQuery) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query ?? {})) {
        if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
    }
    const s = params.toString();
    return s ? `?${s}` : "";
};

/** Текст ошибки API админки: title / detail / message — что вернул бэкенд */
export const errorText = (body: unknown, status: number): string => {
    if (body && typeof body === "object") {
        const b = body as Record<string, unknown>;
        for (const key of ["detail", "title", "message", "error"]) {
            if (typeof b[key] === "string" && b[key]) return b[key];
        }
        // Ошибки проверки полей: {"color": "…"} или {"errors": {"color": "…"}}
        const source = b.errors && typeof b.errors === "object" && !Array.isArray(b.errors) ? (b.errors as Record<string, unknown>) : b;
        const fields = Object.entries(source).filter(([, v]) => typeof v === "string").map(([k, v]) => `${k}: ${String(v)}`);
        if (fields.length) return fields.join("; ");
    }
    return status === 403 ? "Нет доступа" : `Ошибка ${status}`;
};

/**
 * Запросы к API админки (/admin/v1) с входом пользователя: cookie (GS-218) или
 * токен старого SPA. Разделы описаны конфигами (lib/admin/resources), поэтому
 * клиент общий; типы данных разделов — из @goodsurfing/api там, где их видно.
 */
export function useAdminApi() {
    const { token } = useSession();
    const request = useCallback(async <T,>(method: string, path: string, options: { query?: AdminQuery; body?: unknown } = {}): Promise<T> => {
        const headers: Record<string, string> = { Accept: "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const form = options.body instanceof FormData;
        if (options.body !== undefined && !form) headers["Content-Type"] = "application/json";
        const response = await fetch(`${API_URL}/admin/v1/${path.replace(/^\//, "")}${queryString(options.query)}`, {
            method,
            headers,
            credentials: "include",
            body: options.body === undefined ? undefined : form ? (options.body as FormData) : JSON.stringify(options.body),
            signal: AbortSignal.timeout(20_000),
        });
        const text = await response.text();
        let body: unknown = null;
        try {
            body = text ? JSON.parse(text) : null;
        } catch {
            body = text;
        }
        if (!response.ok) throw new AdminApiError(response.status, errorText(body, response.status));
        return body as T;
    }, [token]);
    return useMemo(() => ({
        get: <T,>(path: string, query?: AdminQuery) => request<T>("GET", path, { query }),
        post: <T,>(path: string, body?: unknown) => request<T>("POST", path, { body: body ?? {} }),
        patch: <T,>(path: string, body: unknown) => request<T>("PATCH", path, { body }),
        /** multipart: справочники с картинкой (навыки, категории, условия) */
        postForm: <T,>(path: string, body: FormData) => request<T>("POST", path, { body }),
        del: (path: string) => request<unknown>("DELETE", path),
    }), [request]);
}
