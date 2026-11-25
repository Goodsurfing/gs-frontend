"use client";

import { useEffect } from "react";

import { reachGoal } from "@/components/analytics/YandexMetrika";
import { currentDisplayEnv, isStandalone, PWA_INSTALLED_KEY } from "@/lib/pwa";
import { storageGet, storageSet } from "@/lib/safeStorage";

/**
 * Цель Метрики pwa_installed — первое открытие сайта с экрана «Домой». У
 * установленного сайта на iPhone своё хранилище (не общее с Safari), поэтому
 * отметка в localStorage означает «уже засчитали именно эту установку».
 */
export function PwaInstalledGoal() {
    useEffect(() => {
        const env = currentDisplayEnv();
        if (!isStandalone(env) || storageGet(PWA_INSTALLED_KEY)) return;
        storageSet(PWA_INSTALLED_KEY, String(Date.now()));
        reachGoal("pwa_installed", { platform: /iPhone|iPad|iPod/.test(env.userAgent) ? "ios" : /Android/.test(env.userAgent) ? "android" : "other" });
    }, []);
    return null;
}
