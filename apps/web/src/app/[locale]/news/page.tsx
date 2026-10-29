import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MemberBanner } from "@/components/content/MemberBanner";
import { PublicShell } from "@/components/layout/PublicShell";
import { ArticleCard } from "@/components/list/ArticleCard";
import { CategoryChips } from "@/components/list/CategoryChips";
import { Pagination } from "@/components/list/Pagination";
import { SearchField } from "@/components/list/SearchField";
import { SortToggle } from "@/components/list/SortToggle";
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { serverApi } from "@/lib/api";
import { ARTICLE_SORT, getBlogCategories } from "@/lib/articles";
import { listHref, listParams, type ListParams } from "@/lib/listParams";
import { mediaUrl } from "@/lib/media";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const LIMIT = 10;

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "news");
    return pageMetadata({ locale, path: routes.news(locale), title: t("seo.title"), description: t("seo.description") });
}

async function getNews(locale: Locale, { page, sort, search, category }: ListParams) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/news", {
            params: { query: { page, limit: LIMIT, sort: ARTICLE_SORT[sort], lang: locale, name: search || undefined, categoryId: category } },
            signal: AbortSignal.timeout(5000),
        });
        return data ?? null;
    } catch {
        return null;
    }
}

/** «Новости»: сортировка, поиск, категории, страницы — в адресе (GS-219). */
export default async function NewsPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const filters = listParams(await searchParams);
    const [t, tCommon, tBlog, tVolunteer, data, categories] = await Promise.all([
        getTranslator(locale, "news"),
        getTranslator(locale),
        getTranslator(locale, "blog"),
        getTranslator(locale, "volunteer"),
        getNews(locale, filters),
        getBlogCategories(locale),
    ]);
    const news = data?.data ?? [];
    const pages = data?.pagination ? Math.ceil(data.pagination.total / data.pagination.limit) : 1;
    const base = routes.news(locale);
    // Смена сортировки, поиска или категории — снова с первой страницы (как в старом фронте)
    const href = (change: Partial<ListParams>) => listHref(base, { ...filters, page: 1, ...change });

    return (
        <PublicShell locale={locale} headerVariant="static">
            <section className="mx-auto box-border flex min-h-[200px] w-full max-w-[1920px] items-center justify-center bg-[url(/web/images/news-header.webp)] bg-cover bg-center bg-no-repeat px-40 py-24">
                <h1 className="text-center text-[2.5rem] font-semibold text-white">{tCommon("news")}</h1>
            </section>
            <div className="mx-auto max-w-[1180px] pb-[100px] [@media(max-width:1000px)]:px-[30px]">
                <div className="mt-[60px] flex flex-wrap items-center justify-between gap-2.5">
                    <SortToggle
                        value={filters.sort}
                        href={(sort) => href({ sort })}
                        options={[{ value: "new", text: tCommon("Свежее") }, { value: "popular", text: tCommon("Популярное") }]}
                    />
                    <SearchField basePath={base} params={filters} placeholder={tCommon("Поиск")} label={tCommon("Поиск")} />
                </div>
                <div className="mt-10 flex gap-[30px] down-lg:flex-col-reverse down-lg:flex-wrap">
                    <div className="flex w-full flex-col gap-[15px]">
                        {data && news.length === 0 && (
                            <p className="w-full px-5 py-10 text-center text-[14px] leading-[1.2] font-medium">{t("Новости не найдены")}</p>
                        )}
                        {news.length > 0 && (
                            <div className="grid w-full max-w-[780px] grid-cols-[repeat(auto-fit,minmax(375px,1fr))] gap-[30px] [@media(max-width:1000px)]:grid-cols-1 [@media(max-width:1000px)]:justify-items-center">
                                {news.map((item) => (
                                    <ArticleCard
                                        key={item.id}
                                        href={`${base}/${item.slug}`}
                                        image={mediaUrl(item.image, "large")}
                                        name={item.name}
                                        created={item.created}
                                        tags={item.category ? [item.category] : []}
                                        likeCount={item.likeCount}
                                        reviewCount={item.reviewCount}
                                    />
                                ))}
                            </div>
                        )}
                        <Pagination
                            page={filters.page}
                            count={pages}
                            href={(page) => listHref(base, { ...filters, page })}
                            labels={{ prev: tCommon("pagination.prev"), next: tCommon("pagination.next"), page: tCommon("pagination.label") }}
                        />
                    </div>
                    <div className="flex flex-col gap-[30px]">
                        <CategoryChips
                            title={tBlog("Категория")}
                            categories={categories}
                            value={filters.category}
                            href={(category) => href({ category })}
                        />
                        <MemberBanner
                            locale={locale}
                            className="down-lg:max-w-none"
                            title={tVolunteer("volunteer-dashboard.Оформи членство Гудсёрфинга и открой для себя бескрайний мир путешествий со смыслом!")}
                            button={tVolunteer("volunteer-dashboard.Получить членство")}
                        />
                    </div>
                </div>
            </div>
        </PublicShell>
    );
}
