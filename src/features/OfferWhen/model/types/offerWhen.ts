import { OfferWhen } from "@/entities/Offer";

export interface CreateOfferWhen {
    data: OfferWhen;
}

export type DatePeriods = { start: Date | undefined, end: Date | undefined };

export type TimeSettingsControls = {
    isFullYearAcceptable: boolean;
    isApplicableAtTheEnd: boolean;
};

export type EndSettings = {
    applicationEndDate: Date | undefined;
    isWithoutApplicationDate: boolean;
};

export interface OfferWhenFields {
    periods: DatePeriods[];
    participationPeriod: number[];
    // applicationEndDate: Date;
    timeSettings: TimeSettingsControls;
    endSettings: EndSettings;
}
