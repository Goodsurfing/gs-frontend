import { notFound } from "next/navigation";

import { OffersMap } from "@/components/offers-map/OffersMap";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { offersFiltersQuery, parseOffersFilters } from "@/lib/offersFilters";
import { routes } from "@/lib/routes";

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OffersMapPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const filters = parseOffersFilters(await searchParams);
    const t = await getTranslator(locale);
    const { page: _page, offerId, ...mapFilters } = filters;
    void _page;

    return (
        <div className="h-screen">
            <OffersMap
                locale={locale}
                filtersQuery={offersFiltersQuery(mapFilters)}
                selectedOfferId={offerId}
                offerHref={routes.offer(locale, "{id}")}
                labels={{
                    more: t("Подробнее"),
                    clusterTitle: t("Список вакансий:"),
                    noTitle: t("Без названия"),
                    close: t("Закрыть"),
                    locate: t("Показать моё местоположение"),
                    locateError: t("Не удалось определить местоположение"),
                    noLocation: t("У этой вакансии не указано местоположение на карте"),
                    empty: t("По вашему запросу вакансий на карте не найдено"),
                    loadError: t("Не удалось загрузить вакансии"),
                    loadErrorHint: t("Проверьте соединение и попробуйте ещё раз"),
                    retry: t("Попробовать снова"),
                    mapError: t("Не удалось загрузить карту"),
                    reload: t("Обновить страницу"),
                }}
            />
        </div>
    );
}
