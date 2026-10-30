"use client";

import { useEffect } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { type Locale, localePrefix } from "@/i18n/config";

/**
 * Кабинет — только вошедшим: гостя на вход; кабинет организатора — только
 * с организацией, волонтёра — только с профилем волонтёра, иначе на выбор
 * роли (PrivateRoute*Guard старого фронта).
 */
export function RequireUser({ locale, need }: { locale: Locale; need?: "host" | "volunteer" }) {
    const session = useSession();
    useEffect(() => {
        const prefix = localePrefix(locale);
        if (session.status === "guest") {
            window.location.replace(`${prefix}/signin`);
            return;
        }
        if (session.status !== "user" || !need) return;
        const profile = session.profile as { hostId?: string | null; volunteer?: unknown } | null;
        if ((need === "host" && !profile?.hostId) || (need === "volunteer" && !profile?.volunteer)) window.location.replace(`${prefix}/profile/role`);
    }, [session.status, session.profile, locale, need]);
    return null;
}
