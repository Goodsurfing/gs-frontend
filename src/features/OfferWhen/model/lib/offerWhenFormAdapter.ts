import { formatToW3CDate } from "@/shared/lib/formatToW3CDate";
import { OfferWhenPeriods, OfferWhen } from "@/entities/Offer";
import { OfferWhenFields } from "../types/offerWhen";

export function offerWhenFormAdapter(offerWhenForm: OfferWhenFields): OfferWhen {
    const {
        endSettings,
        participationPeriod,
        periods,
        timeSettings,
        closingDate,
    } = offerWhenForm;

    const offerWhenPeriods: OfferWhenPeriods[] = periods.map((period) => ({
        start: formatToW3CDate(period.start),
        end: formatToW3CDate(period.end),
    }));

    const { isFullYearAcceptable, isApplicableAtTheEnd } = timeSettings;
    const { applicationEndDate, isWithoutApplicationDate } = endSettings;

    const formattedEndDate = formatToW3CDate(applicationEndDate);

    const offerWhen: OfferWhen = {
        periods: offerWhenPeriods,
        durationMinDays: participationPeriod[0],
        durationMaxDays: participationPeriod[1],
        closingDate,
        isWithoutApplicationEndDate: isWithoutApplicationDate,
        applicationEndDate: formattedEndDate,
        isFullYearAcceptable,
        isApplicableAtTheEnd,
    };
    return offerWhen;
}
