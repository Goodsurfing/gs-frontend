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
