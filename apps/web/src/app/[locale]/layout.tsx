import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { isLocale, LOCALES } from "@/i18n/config";

import "../globals.css";

export const metadata: Metadata = {
    title: "GoodSurfing",
    icons: { icon: "/favicon.png" },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://goodsurfing.org"),
};

// Другие первые сегменты — не язык: такие адреса уходят в app/global-not-found.tsx
export const dynamicParams = false;

export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <html lang={locale}>
            <body>{children}</body>
        </html>
    );
}
