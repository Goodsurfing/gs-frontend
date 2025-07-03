/* eslint-disable @typescript-eslint/naming-convention */
import { OffersFilters } from "@/entities/Offer";

import { OffersFilterFields } from "../model/types";

export const offersFilterApiAdapter = (
    data: OffersFilterFields,
): Partial<OffersFilters> => {
    const {
        category,
        languages,
        participationPeriod,
        periods,
        offersSort,
        withChildren,
        provided,
        search,
    } = data;
    const { showClosedOffers, sortValue } = offersSort;
    const popularity = sortValue === "popularity" ? "desc" : undefined;
    const updatedAt = sortValue === "novelty" ? "desc" : undefined;
    const currentDate = new Date();

    const min_duration_days = participationPeriod[0] !== 1
        ? participationPeriod[0].toString()
        : undefined;
    const max_duration_days = participationPeriod[1] !== 190
        ? participationPeriod[1].toString()
        : undefined;

    const start_date = periods.start?.toISOString().split("T")[0];
    const end_date = periods.end?.toISOString().split("T")[0];

    let result_start_date = start_date;

    if (!showClosedOffers) {
        const [datePart] = currentDate.toISOString().split("T");
        result_start_date = datePart;
    }

    const queryParams: Partial<OffersFilters> = {
        min_duration_days,
        max_duration_days,
        start_date: result_start_date,
        end_date,
        "order[popularity]": popularity,
        "order[updatedAt]": updatedAt,
    };

    if (category.length > 0) queryParams.categories = category;
    if (languages.length > 0) queryParams.languages = languages;
    if (withChildren) queryParams.additionalConditions = ["allow-kids"];
    if (search !== "") queryParams.search = search;

    provided.forEach((value) => {
        if (value === "food") {
            queryParams.food = ["full", "breakfast"];
        }
        if (value === "housing") {
            queryParams.housing = ["house", "room"];
        }
        if (value === "paidTravel") {
            queryParams.paidTravel = ["full", "partial"];
        }
    });

    return queryParams;
};
