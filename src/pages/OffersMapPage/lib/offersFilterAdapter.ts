/* eslint-disable @typescript-eslint/naming-convention */
import { GetOffersFilters, OfferSort } from "@/entities/Offer";

import { OffersFilterFields } from "../model/types";
import { formattingDate } from "@/shared/lib/formatDate";

export const offersFilterApiAdapter = (
    data: OffersFilterFields,
): Partial<GetOffersFilters> => {
    const {
        category,
        languages,
        participationPeriod,
        periods,
        offersSort,
        withChildren,
        provided,
        // search,
    } = data;
    const { showClosedOffers, sortValue } = offersSort;
    // const popularity = sortValue === "popularity" ? "desc" : undefined;
    // const updatedAt = sortValue === "novelty" ? "desc" : undefined;
    let sort: OfferSort | undefined;

    if (sortValue === "popularity") {
        sort = OfferSort.PopularityDesc;
    } else if (sortValue === "novelty") {
        sort = OfferSort.UpdatedDesc;
    }
    const minDurationDays = participationPeriod[0] !== 1
        ? participationPeriod[0].toString()
        : undefined;
    const maxDurationDays = participationPeriod[1] !== 190
        ? participationPeriod[1].toString()
        : undefined;

    const start_date = formattingDate(periods.start);
    const end_date = formattingDate(periods.end);

    // showClosedOffers=false ("Показать прошедшие" выключен) — это НЕ то же
    // самое, что пользователь выбрал дату начала участия "от сегодня".
    // Раньше тумблер просто подставлял startDate=сегодня в тот же фильтр
    // periods.start >= startDate, из-за чего вакансии, которые УЖЕ ИДУТ
    // (период начался в прошлом, но ещё не закончился — например
    // 01.04–31.08 при сегодняшнем 19.08), ошибочно пропадали из выдачи,
    // хотя они ещё вполне актуальны. hidePassed — отдельный параметр,
    // бэкенд проверяет periods.ending >= сегодня (закончилось ли), а не
    // periods.start >= сегодня (началось ли).
    const queryParams: Partial<GetOffersFilters> = {
        minDurationDays,
        maxDurationDays,
        startDate: start_date ?? undefined,
        endDate: end_date ?? undefined,
        hidePassed: !showClosedOffers ? true : undefined,
        sort,
    };

    if (category.length > 0) queryParams.categoryIds = category;
    if (languages.length > 0) queryParams.languages = languages;
    if (withChildren) queryParams.additionalConditions = ["allow-kids"];
    // if (search !== "") queryParams.search = search;

    provided.forEach((value) => {
        if (value === "food") {
            queryParams.foodIds = [1, 2, 3];
        }
        if (value === "housing") {
            queryParams.houseIds = [1, 2, 3, 4, 5];
        }
        if (value === "paidTravel") {
            queryParams.transferIds = [1, 2, 3, 4];
        }
    });

    return queryParams;
};
