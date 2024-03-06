import { formatToW3CDate } from "@/shared/lib/formatToW3CDate";
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
        start: formatToW3CDate(period.start),
        end: formatToW3CDate(period.end),
    }));

    const { isFullYearAcceptable, isApplicableAtTheEnd } = timeSettings;
    const { applicationEndDate } = endSettings;

    const formattedEndDate = formatToW3CDate(applicationEndDate);

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
