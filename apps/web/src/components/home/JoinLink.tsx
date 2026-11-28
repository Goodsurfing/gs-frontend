"use client";

import type { ReactNode } from "react";

import { useOptionalSession } from "@/components/session/SessionProvider";

/** Ссылка «Присоединиться»: гостя — на вход, вошедшего — в каталог (как кнопка первого слайда) */
export function JoinLink({ href, signedInHref, className, children }: { href: string; signedInHref: string; className?: string; children: ReactNode }) {
    const session = useOptionalSession();
    return <a href={session?.status === "user" ? signedInHref : href} className={className}>{children}</a>;
}
