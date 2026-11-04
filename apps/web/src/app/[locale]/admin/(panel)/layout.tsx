import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { SessionProvider } from "@/components/session/SessionProvider";

export const metadata: Metadata = { title: "Админка — GoodSurfing", robots: { index: false, follow: false } };

/** Админка (GS-221): внутренний инструмент, только по-русски, данные — в браузере с входом администратора */
export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AdminShell>{children}</AdminShell>
        </SessionProvider>
    );
}
