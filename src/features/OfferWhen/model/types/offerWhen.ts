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

export type OfferWhenFields = Omit<OfferWhen, "periods" | "participationPeriod" | "durationMinDays" | "durationMaxDays" | "isFullYearAcceptable" | "isApplicableAtTheEnd"> & {
    periods: DatePeriods[];
    participationPeriod: number[];
    applicationEndDate: string | boolean;
    timeSettings: TimeSettingsControls;
    endSettings: EndSettings;
};
