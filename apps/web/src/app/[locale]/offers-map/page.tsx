import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { OffersCatalog } from "@/components/offers-map/OffersCatalog";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getCatalogPage } from "@/lib/offersCatalog";
import { filterLanguages, getFilterCategories } from "@/lib/offersFilterOptions";
import { parseOffersFilters } from "@/lib/offersFilters";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "seo");
    return pageMetadata({ locale, path: routes.offersMap(locale), title: t("offersMap.title"), description: t("offersMap.description") });
}

/** Каталог вакансий: список и карта (GS-219). Фильтры, поиск, сортировка и страница — в адресе. */
export default async function OffersMapPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const filters = parseOffersFilters(await searchParams);
    const [t, tMap, tOffer, categories] = await Promise.all([
        getTranslator(locale),
        getTranslator(locale, "offers-map"),
        getTranslator(locale, "offer"),
        getFilterCategories(locale),
    ]);
    const page = await getCatalogPage(locale, filters, t);
    const total = page?.total ?? 0;

    return (
        <PublicShell locale={locale} headerVariant="static" footer={false}>
            <OffersCatalog
                locale={locale}
                basePath={routes.offersMap(locale)}
                filters={filters}
                page={page}
                categories={categories}
                languages={filterLanguages(tOffer)}
                offerHref={routes.offer(locale, "{id}")}
                labels={{
                    count: `${total} ${tMap(`variants_${new Intl.PluralRules(locale).select(total)}`)}`,
                    showPassed: tMap("Показать прошедние"),
                    sortLabel: tMap("По новизне"),
                    sortNovelty: tMap("По новизне"),
                    sortPopularity: tMap("По популярности"),
                    backToMap: t("Вернуться к карте"),
                    hideMap: t("Свернуть карту"),
                    search: tMap("Поиск"),
                    searchLabel: t("Поиск вакансий"),
                    notFound: tMap("Вакансии не были найдены"),
                    loadError: t("Не удалось загрузить вакансии"),
                    loadErrorHint: t("Проверьте соединение и попробуйте ещё раз"),
                    retry: t("Попробовать снова"),
                    pagination: { prev: t("pagination.prev"), next: t("pagination.next"), page: t("pagination.label") },
                    card: {
                        more: t("Подробнее"),
                        notOnMap: t("нет на карте"),
                        reviews: t("Отзывов"),
                        went: t("Отправились"),
                        noTitle: t("Без заголовка"),
                        noDescription: t("Без описания"),
                    },
                    tabs: { list: tMap("Список вакансий"), map: tMap("Карта"), filter: tMap("Фильтр") },
                    filters: {                        from: tMap("Дата начала"),
                        to: tMap("Дата окончания"),
                        notSet: tMap("Не задано"),
                        categories: tMap("Направление деятельности"),
                        duration: tMap("Срок участия"),
                        durationValue: tMap("durationRange", { min: "{{min}}", max: "{{max}}" }),
                        days: tMap("days"),
                        extra: tMap("Доп. фильтры"),
                        withChildren: tMap("Можно с детьми"),
                        languages: tMap("Знание языков"),
                        provided: tMap("Предоставляется"),
                        housing: tMap("Проживание"),
                        food: tMap("Питание"),
                        travel: tMap("Проезд"),
                        apply: tMap("Применить"),
                        reset: tMap("Очистить все"),
                
                    },
                    map: {
                        more: t("Подробнее"),
                        clusterTitle: t("Список вакансий:"),
                        noTitle: t("Без названия"),
                        close: t("Закрыть"),
                        zoomIn: t("Приблизить"),
                        zoomOut: t("Отдалить"),
                        locate: t("Показать моё местоположение"),
                        locateError: t("Не удалось определить местоположение"),
                        noLocation: t("У этой вакансии не указано местоположение на карте"),
                        empty: t("По вашему запросу вакансий на карте не найдено"),
                        loadError: t("Не удалось загрузить вакансии"),
                        loadErrorHint: t("Проверьте соединение и попробуйте ещё раз"),
                        retry: t("Попробовать снова"),
                        mapError: t("Не удалось загрузить карту"),
                        reload: t("Обновить страницу"),
                    },
                }}
            />
        </PublicShell>
    );
}
