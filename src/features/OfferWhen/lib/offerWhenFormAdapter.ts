import { OfferWhen, OfferWhenPeriods } from "@/entities/Offer";

import {
    DatePeriods, EndSettings, OfferWhenFields, TimeSettingsControls,
} from "../model/types/offerWhen";
import { formattingDate } from "@/shared/lib/formatDate";

export const offerWhenFormApiAdapter = (
    offerWhenForm: OfferWhenFields,
): OfferWhen => {
    const {
        endSettings, participationPeriod, periods, timeSettings,
    } = offerWhenForm;

    const { isFullYearAcceptable, isApplicableAtTheEnd } = timeSettings;
    const { applicationEndDate } = endSettings;

    const offerWhenPeriods: OfferWhenPeriods[] = periods.map((period) => ({
        start: formattingDate(period.start),
        ending: formattingDate(period.end),
    }));

    let offerTempWhenPeriods: OfferWhenPeriods[] = offerWhenPeriods;
    if ((offerWhenPeriods.length === 0) || isFullYearAcceptable) {
        offerTempWhenPeriods = [];
    }

    const formattedEndDate = formattingDate(applicationEndDate);

    const offerWhen: OfferWhen = {
        periods: offerTempWhenPeriods,
        durationMinDays: participationPeriod[0],
        durationMaxDays: participationPeriod[1],
        applicationEndDate: formattedEndDate,
        isFullYearAcceptable,
        isApplicableAtTheEnd, // backend issue
    };
    return offerWhen;
};

export const offerWhenFormAdapter = (offerWhen: OfferWhen): OfferWhenFields => {
    const {
        durationMaxDays,
        durationMinDays,
        isApplicableAtTheEnd,
        isFullYearAcceptable,
        applicationEndDate,
        periods,
    } = offerWhen;

    const parseDate = (dateStr?: string) => (dateStr ? new Date(dateStr) : undefined);

    const offerWhenPeriods: DatePeriods[] = periods.map((period) => ({
        start: parseDate(period.start ?? undefined) || new Date(),
        end: parseDate(period.ending ?? undefined) || new Date(),
    }));

    const timeSettings: TimeSettingsControls = {
        isFullYearAcceptable,
        isApplicableAtTheEnd,
    };

    const endSettings: EndSettings = {
        applicationEndDate: parseDate(applicationEndDate ?? undefined),
        isWithoutApplicationDate: !applicationEndDate,
    };

    const offerWhenFields: OfferWhenFields = {
        periods: offerWhenPeriods,
        participationPeriod: [durationMinDays, durationMaxDays],
        timeSettings,
        endSettings,
    };

    return offerWhenFields;
};
