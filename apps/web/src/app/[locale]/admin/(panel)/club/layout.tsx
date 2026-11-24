import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { CLUB_ADMIN_ENABLED } from "@/lib/admin/menu";

/** «Клуб тестировщиков» — только на стейдже: без NEXT_PUBLIC_CLUB_ADMIN=1 (прод) все /admin/club/* — 404 */
export default function ClubLayout({ children }: { children: ReactNode }) {
    if (!CLUB_ADMIN_ENABLED) notFound();
    return children;
}
