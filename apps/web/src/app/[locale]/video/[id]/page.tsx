import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePage, articleMetadata } from "@/components/article/ArticlePage";
import { isLocale } from "@/i18n/config";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    return isLocale(locale) ? articleMetadata("video", locale, decodeURIComponent(id)) : {};
}

export default async function Page({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    return <ArticlePage kind="video" locale={locale} idOrSlug={decodeURIComponent(id)} />;
}
