import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePage, articleMetadata } from "@/components/article/ArticlePage";
import { isLocale } from "@/i18n/config";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    return isLocale(locale) ? articleMetadata("journal", locale, decodeURIComponent(slug)) : {};
}

export default async function Page({ params }: Props) {
    const { locale, slug } = await params;
    if (!isLocale(locale)) notFound();
    return <ArticlePage kind="journal" locale={locale} idOrSlug={decodeURIComponent(slug)} />;
}
