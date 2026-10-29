"use client";

import type { components } from "@goodsurfing/api";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { Locale } from "@/i18n/config";
import { API_URL, browserApi } from "@/lib/browserApi";

import { clearLegacySession, legacyAccessToken, legacyRefreshToken } from "./legacySession";

type Profile = components["schemas"]["ElementResult7"];
type Membership = components["schemas"]["CurrentMembershipResult"];

export interface Session {
    /** unknown — ещё не проверяли (серверный рендер и первый кадр) */
    status: "unknown" | "guest" | "user";
    profile: Profile | null;
    unreadMessages: number;
    memberships: Membership[];
    logout: () => Promise<void>;
    saveLocale: (locale: Locale) => void;
}

const GUEST: Omit<Session, "logout" | "saveLocale"> = { status: "guest", profile: null, unreadMessages: 0, memberships: [] };

const SessionContext = createContext<Session | null>(null);

// Недоступный API не должен держать запрос вечно: через 10 с считаем гостем
const timeout = () => ({ signal: AbortSignal.timeout(10_000) });

/**
 * Кто вошёл — проверяется в браузере, а не на сервере: публичные страницы
 * остаются статическими (ISR) и одинаковыми для всех, а блок пользователя в
 * шапке дорисовывается после загрузки. Так же было в старом SPA.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<Omit<Session, "logout" | "saveLocale">>({ ...GUEST, status: "unknown" });
    const [token, setToken] = useState<string | undefined>();

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            // Сначала cookie; если её нет — вход из старого SPA (переходный период)
            let auth: string | undefined;
            let profile = (await browserApi().GET("/api/v1/profile", timeout()).catch(() => null))?.data;
            const fallback = legacyAccessToken();
            if (!profile && fallback) {
                profile = (await browserApi(fallback).GET("/api/v1/profile", timeout()).catch(() => null))?.data;
                if (profile) auth = fallback;
            }
            if (cancelled) return;
            if (!profile) {
                setState(GUEST);
                return;
            }
            setToken(auth);
            setState({ status: "user", profile, unreadMessages: 0, memberships: [] });

            const api = browserApi(auth);
            const [unread, memberships] = await Promise.all([
                api.GET("/api/v1/personal/unread-messages", timeout()).catch(() => null),
                api.GET("/api/v1/membership/current-all", timeout()).catch(() => null),
            ]);
            if (cancelled) return;
            const count = (unread?.data as { unreadMessagesCount?: unknown } | undefined)?.unreadMessagesCount;
            setState((prev) => ({
                ...prev,
                unreadMessages: typeof count === "number" ? count : 0,
                memberships: Array.isArray(memberships?.data) ? memberships.data : [],
            }));
        };
        void load();
        return () => {
            cancelled = true;
        };
    }, []);

    const logout = useCallback(async () => {
        const refresh = legacyRefreshToken();
        await fetch(`${API_URL}/api/v1/token/logout`, {
            method: "POST",
            credentials: "include",
            keepalive: true,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(refresh ? { refresh_token: refresh } : {}),
        }).catch(() => undefined);
        clearLegacySession();
        setState(GUEST);
    }, []);

    // Язык писем и интерфейса — в профиль; переход на другой язык не ждёт ответа
    const saveLocale = useCallback((locale: Locale) => {
        if (state.status !== "user") return;
        void browserApi(token).PATCH("/api/v1/profile/locale", { body: { locale }, keepalive: true }).catch(() => undefined);
    }, [state.status, token]);

    const value = useMemo(() => ({ ...state, logout, saveLocale }), [state, logout, saveLocale]);
    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** Для компонентов, которые бывают и вне каркаса страницы (переключатель языка). */
export const useOptionalSession = (): Session | null => useContext(SessionContext);

export function useSession(): Session {
    const session = useContext(SessionContext);
    if (!session) throw new Error("useSession вне SessionProvider");
    return session;
}

/** Активное членство категории (REGULAR — обычное, INTERNATIONAL — клуб). */
export const activeMembership = (memberships: Membership[], category: "REGULAR" | "INTERNATIONAL") => memberships
    .find((item) => item.isActive && (item.tariff as { category?: string } | null | undefined)?.category === category);
