"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { ReportLabels } from "@/lib/report";

const ReportContext = createContext<ReportLabels | null>(null);

/**
 * Подписи «Пожаловаться / Заблокировать» для страницы (GS-282): страница кладёт их один раз,
 * кнопки у сообщений, отзывов и профилей берут отсюда. Нет провайдера — кнопок нет.
 */
export function ReportProvider({ labels, children }: { labels: ReportLabels; children: ReactNode }) {
    return <ReportContext.Provider value={labels}>{children}</ReportContext.Provider>;
}

export const useReportLabels = (): ReportLabels | null => useContext(ReportContext);
