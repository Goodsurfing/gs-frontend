import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { OPTIONAL_BLOCK_TIMEOUT_MS, serverApi } from "@/lib/api";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "seo");
    return pageMetadata({ locale, path: routes.categories(locale), title: t("categories.title"), description: t("categories.description") });
}

async function getCategories(locale: Locale) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/category", {
            params: { query: { lang: locale } },
            signal: AbortSignal.timeout(Math.max(OPTIONAL_BLOCK_TIMEOUT_MS, 5000)),
        });
        return (data ?? []).map((category) => ({
            id: category.id,
            name: category.name ?? "",
            image: (category as { imagePath?: string }).imagePath,
            count: (category as { vacancyCount?: number }).vacancyCount ?? 0,
        }));
    } catch {
        return [];
    }
}

/** «Выбирайте по интересам»: все направления с числом вакансий (CategoriesPage старого фронта, GS-219) */
export default async function CategoriesPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, categories] = await Promise.all([getTranslator(locale), getCategories(locale)]);
    const plural = new Intl.PluralRules(locale);
    const count = (value: number) => `${value} ${t(`category-offer.vacancyCount_${plural.select(value)}`)}`;

    return (
        <PublicShell locale={locale} topGap>
            <div className="mx-auto max-w-[1400px] px-[50px] pt-[65px] pb-[120px] down-lg:px-5">
                <h1 className="mx-auto text-center text-[1.5em] font-bold">{t("category-offer.Выбирайте по интересам")}</h1>
                <div className="mt-10 flex w-full flex-wrap gap-x-5 gap-y-[50px] down-lg:justify-center">
                    {categories.map((category) => (category.image ? (
                        <a
                            key={category.id}
                            href={routes.offersMapCategory(locale, category.id)}
                            style={{ backgroundImage: `url(${JSON.stringify(category.image)})` }}
                            className="relative flex min-h-[280px] w-full max-w-[180px] shrink-0 cursor-pointer items-end bg-cover bg-center bg-no-repeat p-5 transition-opacity duration-300 hover:opacity-80"
                        >
                            <div className="w-full">
                                <span lang={locale} className="text-[1.125rem] leading-[1.4rem] font-medium break-words text-white">{category.name}</span>
                                <br />
                                <span className="pt-2.5 text-[0.875rem] leading-[1.1rem] font-medium text-white">{count(category.count)}</span>
                            </div>
                        </a>
                    ) : (
                        // Категория без картинки в старом фронте не была ссылкой — оставлено так же
                        <div key={category.id} className="relative flex min-h-[280px] w-full max-w-[180px] shrink-0 items-end border border-accent-bg bg-white p-5">
                            {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                            <img src="/web/images/home/three-dots.svg" alt="" className="absolute top-1/2 left-1/2 h-1.5 w-[34px] -translate-1/2" />
                            <div className="w-full">
                                <span lang={locale} className="text-[1.125rem] leading-[1.4rem] font-medium break-words text-ink-secondary">{category.name}</span>
                                <br />
                                <span className="pt-2.5 text-[0.875rem] leading-[1.1rem] font-medium text-ink-secondary">{count(category.count)}</span>
                            </div>
                        </div>
                    )))}
                </div>
            </div>
        </PublicShell>
    );
}
