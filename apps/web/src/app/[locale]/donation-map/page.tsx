import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DonationsCatalog } from "@/components/donations-map/DonationsCatalog";
import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getDonationsPage } from "@/lib/donationsCatalog";
import { parseDonationsFilters } from "@/lib/donationsFilters";
import { getFilterCategories } from "@/lib/offersFilterOptions";
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
    return pageMetadata({ locale, path: routes.donationsMap(locale), title: t("donationsMap.title"), description: t("donationsMap.description") });
}

/** Каталог сборов пожертвований: список и карта (DonationsMapPage старого фронта, GS-219) */
export default async function DonationsMapPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const filters = parseDonationsFilters(await searchParams);
    const [t, tDonation, categories, page] = await Promise.all([
        getTranslator(locale),
        getTranslator(locale, "donation"),
        getFilterCategories(locale),
        getDonationsPage(locale, filters),
    ]);
    const total = page?.total ?? 0;

    return (
        <PublicShell locale={locale} headerVariant="static" footer={false}>
            <DonationsCatalog
                locale={locale}
                basePath={routes.donationsMap(locale)}
                filters={filters}
                page={page}
                categories={categories}
                fundraiseHref={routes.fundraise(locale, "{id}")}
                labels={{
                    count: `${total} ${tDonation(`variants_${new Intl.PluralRules(locale).select(total)}`)}`,
                    sortLabel: tDonation("По срочности"),
                    sortUrgency: tDonation("По срочности"),
                    sortPopular: tDonation("По популярности"),
                    backToMap: tDonation("Вернуться к карте"),
                    hideMap: t("Свернуть карту"),
                    search: tDonation("Поиск"),
                    searchLabel: tDonation("Поиск"),
                    notFound: tDonation("Сборы не были найдены"),
                    loadError: tDonation("Произошла ошибка"),
                    retry: t("Попробовать снова"),
                    categories: tDonation("Направление деятельности"),
                    showClosed: tDonation("Показать завершенные проекты"),
                    onlySuccess: tDonation("Показать только успешные проекты"),
                    apply: tDonation("Применить"),
                    reset: tDonation("Очистить все"),
                    successBadge: tDonation("Успешный проект"),
                    collected: tDonation("Собрано"),
                    projectCollected: tDonation("Проект собрал"),
                    left: tDonation("Осталось"),
                    pagination: { prev: t("pagination.prev"), next: t("pagination.next"), page: t("pagination.label") },
                    tabs: { list: tDonation("Список сборов"), map: tDonation("Карта"), filter: tDonation("Фильтр") },
                    map: {
                        more: t("Подробнее"),
                        clusterTitle: tDonation("Список сборов"),
                        noTitle: t("Без названия"),
                        close: t("Закрыть"),
                        zoomIn: t("Приблизить"),
                        zoomOut: t("Отдалить"),
                        locate: t("Показать моё местоположение"),
                        locateError: t("Не удалось определить местоположение"),
                        noLocation: tDonation("Сборы не были найдены"),
                        empty: tDonation("Сборы не были найдены"),
                        loadError: tDonation("Произошла ошибка"),
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
