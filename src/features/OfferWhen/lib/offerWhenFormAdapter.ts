import { OfferWhenPeriods, OfferWhen } from "@/entities/Offer";
import { OfferWhenFields } from "../model/types/offerWhen";

export function offerWhenFormApiAdapter(offerWhenForm: OfferWhenFields): OfferWhen {
    const {
        endSettings,
        participationPeriod,
        periods,
        timeSettings,
    } = offerWhenForm;

    const offerWhenPeriods: OfferWhenPeriods[] = periods.map((period) => ({
        start: period.start.toLocaleDateString(),
        end: period.end.toLocaleDateString(),
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
}
