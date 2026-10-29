import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MemberBanner } from "@/components/content/MemberBanner";
import { PublicShell } from "@/components/layout/PublicShell";
import { CategoryChips } from "@/components/list/CategoryChips";
import { Pagination } from "@/components/list/Pagination";
import { SearchField } from "@/components/list/SearchField";
import { SortToggle } from "@/components/list/SortToggle";
import { AddVideoDialog } from "@/components/video/AddVideoDialog";
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { serverApi } from "@/lib/api";
import { listHref, listParams, type ListParams } from "@/lib/listParams";
import { mediaUrl } from "@/lib/media";
import { getFilterCategories } from "@/lib/offersFilterOptions";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const LIMIT = 10;
const SORT = { new: "created:desc", popular: "likeCount:desc" } as const;

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "video");
    const meta = pageMetadata({ locale, path: routes.video(locale), title: t("seo.title"), description: t("seo.description") });
    return { ...meta, keywords: t("seo.keywords"), openGraph: { ...meta.openGraph, title: t("seo.ogTitle"), description: t("seo.ogDescription") } };
}

async function getVideos(locale: Locale, { page, sort, search, category }: ListParams) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/video", {
            params: { query: { page, limit: LIMIT, sort: SORT[sort], lang: locale, name: search || undefined, categoryId: category } },
            signal: AbortSignal.timeout(5000),
        });
        return data ?? null;
    } catch {
        return null;
    }
}


/** «Видео»: сортировка, поиск, категории направлений, страницы — в адресе; «Добавить видео» (VideoPage старого фронта, GS-219) */
export default async function VideoPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const filters = listParams(await searchParams);
    const [t, tCommon, tVolunteer, data, categories] = await Promise.all([
        getTranslator(locale, "video"),
        getTranslator(locale),
        getTranslator(locale, "volunteer"),
        getVideos(locale, filters),
        getFilterCategories(locale),
    ]);
    const videos = data?.data ?? [];
    const pages = data?.pagination ? Math.ceil(data.pagination.total / data.pagination.limit) : 1;
    const base = routes.video(locale);
    const href = (change: Partial<ListParams>) => listHref(base, { ...filters, page: 1, ...change });

    return (
        <PublicShell locale={locale} headerVariant="static">
            <section className="mx-auto box-border flex min-h-[200px] w-full max-w-[1920px] items-center justify-center bg-[url(/web/images/video-header.webp)] bg-cover bg-center bg-no-repeat px-40 py-24">
                <h1 className="text-center text-[2.5rem] font-semibold text-white">{tCommon("Видео")}</h1>
            </section>
            <div className="mx-auto max-w-[1180px] pb-[100px] [@media(max-width:1000px)]:px-[30px]">
                <div className="mt-[60px] flex items-center justify-between gap-x-[30px] gap-y-2.5">
                    <div className="flex w-full justify-between gap-2.5">
                        <SortToggle
                            value={filters.sort}
                            href={(sort) => href({ sort })}
                            options={[{ value: "new", text: tCommon("Свежее") }, { value: "popular", text: tCommon("Популярное") }]}
                        />
                        <AddVideoDialog
                            categories={categories}
                            labels={{
                                open: t("Добавить видео"),
                                title: t("Добавить видео"),
                                name: t("Название видео"), namePlaceholder: t("Введите название видео"),
                                description: t("Описание видео"), descriptionPlaceholder: t("Введите описание видео"),
                                url: t("Ссылка на видео"), urlPlaceholder: t("Введите ссылку на видео"),
                                cover: tCommon("Добавить фото"), coverRequired: t("Загрузите обложку"),
                                category: t("Категория видео"), categoryRequired: t("Выберите категорию"),
                                required: { name: t("Название обязательно"), description: t("Описание обязательно"), url: t("Ссылка обязательна") },
                                min: t("Минимум 2 символа"), max: t("Максимум 100 символов"),
                                publish: t("Опубликовать"), close: tCommon("Закрыть"),
                                success: "Видео успешно добавлено", error: "Ошибка при добавлении видео",
                            }}
                        />
                    </div>
                    <SearchField basePath={base} params={filters} placeholder={tCommon("Поиск")} label={tCommon("Поиск")} />
                </div>
                <div className="mt-10 flex gap-[30px] down-lg:flex-col-reverse down-lg:flex-wrap">
                    <div className="flex w-full flex-col gap-[15px]">
                        {data && videos.length === 0 && (
                            <p className="w-full px-5 py-10 text-center text-[14px] leading-[1.2] font-medium">{t("Видео не найдены")}</p>
                        )}
                        {videos.length > 0 && (
                            <div className="grid w-full max-w-[780px] grid-cols-[repeat(auto-fit,minmax(375px,1fr))] gap-[30px] [@media(max-width:1000px)]:grid-cols-1 [@media(max-width:1000px)]:justify-items-center">
                                {videos.map((video) => {
                                    const image = mediaUrl(video.image, "large");
                                    return (
                                        <a key={video.id} href={`${base}/${video.id}`} className="max-w-[337px] cursor-pointer down-sm:max-w-none">
                                            <div className="flex flex-col">
                                                {image
                                                    // eslint-disable-next-line @next/next/no-img-element -- обложка из хранилища
                                                    ? <img src={image} alt="preview" className="h-[190px] w-[337px] object-cover down-sm:w-full" />
                                                    : <div className="h-[190px] w-[337px] bg-accent-bg down-sm:w-full" />}
                                                <span className="mt-5 text-[18px] font-medium">{video.name}</span>
                                                <div className="mt-2 flex items-center gap-5">
                                                    <span className="text-[14px] text-caption">{video.created}</span>
                                                    {video.category && (
                                                        <div style={{ backgroundColor: video.category.color }} className="flex items-start justify-center rounded-[40px] px-2.5 py-[3px] text-[14px]">
                                                            {video.category.name}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-2 flex items-center">
                                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                                    <img src="/web/icons/ui/thumbs-up.svg" alt="likes" className="mr-1.5 h-4 w-4" />
                                                    <span className="text-[14px] font-bold">{video.likeCount}</span>
                                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                                    <img src="/web/icons/ui/comment.svg" alt="comments" className="mr-1.5 ml-3.5 h-4 w-4" />
                                                    <span className="text-[14px] font-bold">{video.reviewCount}</span>
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                        <Pagination
                            page={filters.page}
                            count={pages}
                            href={(page) => listHref(base, { ...filters, page })}
                            labels={{ prev: tCommon("pagination.prev"), next: tCommon("pagination.next"), page: tCommon("pagination.label") }}
                        />
                    </div>
                    <div className="flex max-w-[370px] flex-col gap-[30px]">
                        <CategoryChips title={t("Категория")} categories={categories} value={filters.category} href={(category) => href({ category })} />
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
