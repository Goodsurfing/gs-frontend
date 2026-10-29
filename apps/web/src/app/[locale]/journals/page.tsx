import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { Pagination } from "@/components/list/Pagination";
import { SortToggle } from "@/components/list/SortToggle";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { serverApi } from "@/lib/api";
import { listHref, listParams, type ListSort } from "@/lib/listParams";
import { mediaUrl } from "@/lib/media";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const LIMIT = 9;
const SORT: Record<ListSort, "created:desc" | "likeNews:desc"> = { new: "created:desc", popular: "likeNews:desc" };

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "journals");
    return pageMetadata({ locale, path: routes.journals(locale), title: t("seo.title"), description: t("seo.description") });
}

async function getJournals(locale: Parameters<typeof serverApi>[0], page: number, sort: ListSort) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/journal", {
            params: { query: { page, limit: LIMIT, sort: SORT[sort] } },
            signal: AbortSignal.timeout(5000),
        });
        return data ?? null;
    } catch {
        return null;
    }
}

/** «Журналы»: список с сортировкой и страницами (GS-219). */
export default async function JournalsPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const { page, sort } = listParams(await searchParams);
    const [t, tCommon, data] = await Promise.all([
        getTranslator(locale, "journals"),
        getTranslator(locale),
        getJournals(locale, page, sort),
    ]);
    const journals = data?.data ?? [];
    const pages = data?.pagination ? Math.ceil(data.pagination.total / data.pagination.limit) : 1;
    const base = routes.journals(locale);

    return (
        <PublicShell locale={locale} topGap>
            <section className="mx-auto box-border flex min-h-[200px] w-full max-w-[1920px] items-center justify-center bg-[url(/web/images/journals-header.webp)] bg-cover bg-center bg-no-repeat px-40 py-24">
                <h1 className="text-center text-[2.5rem] font-semibold text-white">{tCommon("journals")}</h1>
            </section>
            <div className="mx-auto max-w-[1180px] pb-[100px] [@media(max-width:1000px)]:px-[30px]">
                <div className="mt-[60px] flex items-center justify-between">
                    <SortToggle
                        value={sort}
                        href={(value) => listHref(base, { sort: value })}
                        options={[{ value: "new", text: tCommon("Свежее") }, { value: "popular", text: tCommon("Популярное") }]}
                    />
                </div>
                <div className="mt-10 flex gap-[30px]">
                    <div className="flex w-full flex-col gap-[15px]">
                        {data && journals.length === 0 && (
                            <p className="w-full px-5 py-10 text-center text-[14px] leading-[1.2] font-medium">{t("Журналы не найдены")}</p>
                        )}
                        {journals.length > 0 && (
                            <div className="grid w-full max-w-[1180px] grid-cols-3 gap-[30px] down-sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                                {journals.map((journal) => (
                                    <div key={journal.id} className="flex max-w-[320px] cursor-pointer flex-col">
                                        <a href={`${base}/${journal.slug}`} className="text-inherit no-underline">
                                            {/* eslint-disable-next-line @next/next/no-img-element -- обложка из хранилища; строчная, как в старом фронте */}
                                            <img src={mediaUrl(journal.image, "medium") ?? ""} alt={journal.name} className="min-h-[200px] w-full max-w-[320px] object-cover" />
                                            <span className="mt-5 text-[18px] font-medium">{journal.name}</span>
                                            <div className="mt-2 flex items-center gap-5">
                                                <span className="text-[14px] text-caption">{journal.created}</span>
                                            </div>
                                            <p className="mt-2 text-[14px] text-caption" />
                                            <div className="mt-2 flex items-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                                <img src="/web/icons/ui/thumbs-up.svg" alt="likes" className="mr-1.5 h-4 w-4" />
                                                <span className="text-[14px] font-bold">{journal.likeCount}</span>
                                                {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                                <img src="/web/icons/ui/comment.svg" alt="comments" className="mr-1.5 ml-3.5 h-4 w-4" />
                                                <span className="text-[14px] font-bold">{journal.reviewCount}</span>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Pagination
                            page={page}
                            count={pages}
                            href={(target) => listHref(base, { sort, page: target })}
                            labels={{ prev: tCommon("pagination.prev"), next: tCommon("pagination.next"), page: tCommon("pagination.label") }}
                        />
                    </div>
                </div>
            </div>
        </PublicShell>
    );
}
