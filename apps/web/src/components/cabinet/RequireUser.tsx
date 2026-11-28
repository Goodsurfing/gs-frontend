"use client";

import { useEffect } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { type Locale, localePrefix } from "@/i18n/config";
import { signInReturningTo } from "@/lib/authSession";

/**
 * Кабинет — только вошедшим: гостя на вход; кабинет организатора — только
 * с организацией, волонтёра — только с профилем волонтёра, иначе на выбор
 * роли (PrivateRoute*Guard старого фронта). После входа гость вернётся
 * на эту же страницу (?next=) — ссылки из писем ведут в переписку и заявки.
 */
export function RequireUser({ locale, need }: { locale: Locale; need?: "host" | "volunteer" }) {
    const session = useSession();
    useEffect(() => {
        const prefix = localePrefix(locale);
        if (session.status === "guest") {
            window.location.replace(signInReturningTo(`${prefix}/signin`, window.location.pathname, window.location.search));
            return;
        }
        if (session.status !== "user" || !need) return;
        const profile = session.profile as { hostId?: string | null; volunteer?: unknown } | null;
        if ((need === "host" && !profile?.hostId) || (need === "volunteer" && !profile?.volunteer)) window.location.replace(`${prefix}/profile/role`);
    }, [session.status, session.profile, locale, need]);
    return null;
}
