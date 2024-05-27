import { OfferWhen, OfferWhenApi, OfferWhenPeriods } from "@/entities/Offer";

import {
    DatePeriods, EndSettings, OfferWhenFields, TimeSettingsControls,
} from "../model/types/offerWhen";

export const offerWhenFormApiAdapter = (
    offerWhenForm: OfferWhenFields,
): OfferWhen => {
    const {
        endSettings, participationPeriod, periods, timeSettings,
    } = offerWhenForm;

    const offerWhenPeriods: OfferWhenPeriods[] = periods.map((period) => ({
        start: period.start ? period.start.toLocaleDateString() : null,
        end: period.end ? period.end.toLocaleDateString() : null,
    }));

    const { isFullYearAcceptable, isApplicableAtTheEnd } = timeSettings;
    const { applicationEndDate } = endSettings;

    const formattedEndDate = applicationEndDate.toLocaleDateString();

    const offerWhen: OfferWhen = {
        periods: offerWhenPeriods,
        durationMinDays: participationPeriod[0],
        durationMaxDays: participationPeriod[1],
        // isWithoutApplicationEndDate: isWithoutApplicationDate,
        applicationEndDate: formattedEndDate,
        isFullYearAcceptable,
        isApplicableAtTheEnd,
    };
    return offerWhen;
};

export const offerWhenFormAdapter = (offerWhen: OfferWhenApi): OfferWhenFields => {
    const {
        durationMaxDays,
        durationMinDays,
        isApplicableAtTheEnd,
        isFullYearAcceptable,
        applicationEndDate,
        periods,
    } = offerWhen;

    let offerWhenPeriods: DatePeriods[] = [];
    if (periods.length > 0) {
        offerWhenPeriods = periods.map((period) => {
            if (period.start && period.end) {
                return ({
                    start: new Date(period.start.date),
                    end: new Date(period.end.date),
                });
            }
            return ({
                start: new Date(),
                end: new Date(),
            });
        });
    } else {
        offerWhenPeriods = [{ start: new Date(), end: new Date() }];
    }

    const timeSettings: TimeSettingsControls = {
        isFullYearAcceptable,
        isApplicableAtTheEnd,
    };

    const endSettings: EndSettings = {
        applicationEndDate: new Date(applicationEndDate || ""),
        isWithoutApplicationDate: !applicationEndDate,
    };

    const offerWhenFields: OfferWhenFields = {
        periods: offerWhenPeriods,
        participationPeriod: [durationMinDays, durationMaxDays],
        applicationEndDate: new Date(applicationEndDate || ""),
        timeSettings,
        endSettings,
    };

    return offerWhenFields;
};
