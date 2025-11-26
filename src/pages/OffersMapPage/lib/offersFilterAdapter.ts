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
    const currentDate = new Date();

    const minDurationDays = participationPeriod[0] !== 1
        ? participationPeriod[0].toString()
        : undefined;
    const maxDurationDays = participationPeriod[1] !== 190
        ? participationPeriod[1].toString()
        : undefined;

    const start_date = formattingDate(periods.start);
    const end_date = formattingDate(periods.end);

    let result_start_date = start_date;

    if (!showClosedOffers) {
        const [datePart] = currentDate.toISOString().split("T");
        result_start_date = datePart;
    }

    const queryParams: Partial<GetOffersFilters> = {
        minDurationDays,
        maxDurationDays,
        startDate: result_start_date ?? undefined,
        endDate: end_date ?? undefined,
        sort,
    };

    if (category.length > 0) queryParams.categoryIds = category;
    if (languages.length > 0) queryParams.languages = languages;
    if (withChildren) queryParams.additionalConditions = ["allow-kids"];
    // if (search !== "") queryParams.search = search;

    provided.forEach((value) => {
        if (value === "food") {
            queryParams.foodIds = ["full", "breakfast"];
        }
        if (value === "housing") {
            queryParams.houseIds = ["house", "room"];
        }
        if (value === "paidTravel") {
            queryParams.transferIds = ["full", "partial"];
        }
    });

    return queryParams;
};
