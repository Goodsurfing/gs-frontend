import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePage, articleMetadata } from "@/components/article/ArticlePage";
import { isLocale } from "@/i18n/config";

export const revalidate = 300;

/**
 * Кэш страницы (ISR): без generateStaticParams страница с параметром в адресе
 * рендерилась на каждый показ (cache-control: no-store), и обход поисковиком
 * пачкой страниц грузил процессор (04.11 — до 7 с на страницу). Пустой список:
 * при сборке ничего не готовим, каждая страница рендерится при первом заходе
 * и отдаётся из кэша, обновляясь раз в revalidate секунд. Личное (откликнуться,
 * редактировать) браузер дозапрашивает сам — в кэше только общие данные.
 */
export function generateStaticParams() {
    return [];
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    return isLocale(locale) ? articleMetadata("news", locale, decodeURIComponent(slug)) : {};
}

export default async function Page({ params }: Props) {
    const { locale, slug } = await params;
    if (!isLocale(locale)) notFound();
    return <ArticlePage kind="news" locale={locale} idOrSlug={decodeURIComponent(slug)} />;
}
