export interface OfferWhenPeriods {
    start: string;
    end: string;
}

export interface OfferWhen {
    periods?: OfferWhenPeriods[];
    isFullYearAcceptable: boolean;
    isApplicableAtTheEnd: boolean;
    durationMinDays: number;
    durationMaxDays: number;
    applicationEndDate?: string;
    // isWithoutApplicationEndDate: boolean;
}

export interface OfferWhenPeriodsApi {
    start?: { date: string };
    end?: { date: string };
}

export interface OfferWhenApi {
    id: string;
    periods: OfferWhenPeriodsApi[];
    isFullYearAcceptable: boolean;
    durationMinDays: number;
    durationMaxDays: number;
    isApplicableAtTheEnd: boolean;
    applicationEndDate: string;
}
