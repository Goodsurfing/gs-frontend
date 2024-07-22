import { OfferWhen, OfferWhenPeriods } from "@/entities/Offer";

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
        ending: period.end ? period.end.toLocaleDateString() : null,
    }));
    let offerTempWhenPeriods: OfferWhenPeriods[] = offerWhenPeriods;
    if (!offerWhenPeriods[0].start || !offerWhenPeriods[0].ending) {
        offerTempWhenPeriods = [];
    }

    const { isFullYearAcceptable } = timeSettings;
    const { applicationEndDate } = endSettings;

    const formattedEndDate = applicationEndDate?.toLocaleDateString();

    const offerWhen: OfferWhen = {
        periods: offerTempWhenPeriods,
        durationMinDays: participationPeriod[0],
        durationMaxDays: participationPeriod[1],
        // isWithoutApplicationEndDate: isWithoutApplicationDate,
        applicationEndDate: formattedEndDate || null,
        isFullYearAcceptable,
        isApplicableAtTheEnd: endSettings.isWithoutApplicationDate,
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

    let offerWhenPeriods: DatePeriods[] = [];
    if (periods.length > 0) {
        offerWhenPeriods = periods.map((period) => {
            if (period.start && period.ending) {
                return ({
                    start: new Date(period.start),
                    end: new Date(period.ending),
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
        timeSettings,
        endSettings,
    };

    return offerWhenFields;
};
