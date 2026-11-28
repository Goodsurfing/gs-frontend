"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { recordPage } from "@/lib/backNavigation";

/** Запоминает переходы по сайту во вкладке — для стрелки «Назад» на отклике (lib/backNavigation) */
export function NavigationTrail() {
    const pathname = usePathname();
    useEffect(() => {
        // В браузере usePathname — адрес без внутреннего /ru; берём адрес окна, чтобы не зависеть от rewrite
        recordPage(window.location.pathname);
    }, [pathname]);
    return null;
}
