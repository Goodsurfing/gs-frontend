export interface OfferWhenPeriods {
    start: string | null;
    ending: string | null;
}

export interface OfferWhen {
    periods: OfferWhenPeriods[];
    isFullYearAcceptable: boolean;
    isApplicableAtTheEnd: boolean;
    durationMinDays: number;
    durationMaxDays: number;
    applicationEndDate: string | null;
    // isWithoutApplicationEndDate: boolean;
}
