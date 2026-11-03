"use client";

import { useEffect } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { nextRoute } from "@/lib/authSession";

/**
 * Вошедшему нечего делать на страницах входа: туда, куда вёл ?next=&nextId=
 * (как после входа в SignInForm), иначе — на главную, как в старом фронте.
 * Так «Поддержать» / «Откликнуться», нажатые до того, как сессия узнала
 * вошедшего, не теряют цель.
 */
export function RedirectIfSignedIn({ href, prefix }: { href: string; prefix: string }) {
    const session = useSession();
    useEffect(() => {
        if (session.status !== "user") return;
        const params = new URLSearchParams(window.location.search);
        window.location.replace(nextRoute(prefix, params.get("next"), params.get("nextId")) ?? href);
    }, [session.status, href, prefix]);
    return null;
}
