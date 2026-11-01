"use client";

import { useEffect } from "react";

import { useSession } from "@/components/session/SessionProvider";

/** Вошедшему нечего делать на страницах входа — на главную, как в старом фронте */
export function RedirectIfSignedIn({ href }: { href: string }) {
    const session = useSession();
    useEffect(() => {
        if (session.status === "user") window.location.replace(href);
    }, [session.status, href]);
    return null;
}
