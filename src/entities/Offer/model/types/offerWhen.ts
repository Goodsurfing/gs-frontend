export interface OfferWhenPeriods {
    start: string | null;
    end: string | null;
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

export interface OldOfferWhenPeriods {
    start: string | null;
    ending: string | null;
}

export interface OldOfferWhen {
    periods: OldOfferWhenPeriods[];
    isFullYearAcceptable: boolean;
    isApplicableAtTheEnd: boolean;
    durationMinDays: number;
    durationMaxDays: number;
    applicationEndDate: string | null;
}
