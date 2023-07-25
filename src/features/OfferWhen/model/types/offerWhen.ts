import { OfferWhen } from "@/entities/Offer";

export interface CreateOfferWhen {
    data: OfferWhen;
}

export type DatePeriods = { start: Date, end: Date };

export type TimeSettingsControls = {
    isFullYearAcceptable: boolean;
    isApplicableAtTheEnd: boolean;
};

export type EndSettings = {
    applicationEndDate: Date;
    isWithoutApplicationDate: boolean;
};

export interface OfferWhenFields {
    periods: DatePeriods[]; //
    participationPeriod: number[]; //
    applicationEndDate: Date; //
    timeSettings: TimeSettingsControls; //
    endSettings: EndSettings;
}
