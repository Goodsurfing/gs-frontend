import {
    AddressFormFormFields, DatePeriods, EndSettings, OfferWhenFields, TimeSettingsControls,
} from "@/features/Offer";
import { UpdateAdminVacancyWhen, UpdateAdminVacancyWhere, UpdateAdminVacancyWhoNeeds } from "../model/types/adminSchema";
import { formattingDate, parseDateApi } from "@/shared/lib/formatDate";
import { OfferWhoNeedsFields } from "@/features/OfferWhoNeedsForm";

// OfferWhere

export const offerWhereApiAdapter = (addressForm: AddressFormFormFields):
UpdateAdminVacancyWhere => {
    const { address } = addressForm;
    const pos = address.geoObject?.Point.pos || "";
    const [longitude, latitude] = pos.split(" ").map(Number);
    return { address: address.address, longitude, latitude };
};

// OfferWhen

export const offerWhenFormAdapter = (data: UpdateAdminVacancyWhen): OfferWhenFields => {
    const {
        periods, applicationEndDate, durationMaxDays,
        durationMinDays, isApplicableAtTheEnd, isFullYearAcceptable,
    } = data;

    const offerWhenPeriods: DatePeriods[] = periods.map((period) => ({
        start: parseDateApi(period.start ?? undefined) || new Date(),
        end: parseDateApi(period.end ?? undefined) || new Date(),
    }));

    const timeSettings: TimeSettingsControls = {
        isFullYearAcceptable,
        isApplicableAtTheEnd,
    };

    const endSettings: EndSettings = {
        applicationEndDate: parseDateApi(applicationEndDate ?? undefined),
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

export const offerWhenFormApiAdapter = (data: OfferWhenFields): UpdateAdminVacancyWhen => {
    const {
        periods, endSettings, participationPeriod,
        timeSettings,
    } = data;

    const { isFullYearAcceptable, isApplicableAtTheEnd } = timeSettings;
    const { applicationEndDate } = endSettings;

    const offerWhenPeriods = periods.map((period) => ({
        id: null,
        start: formattingDate(period.start),
        end: formattingDate(period.end),
    }));

    let offerTempWhenPeriods = offerWhenPeriods;
    if ((offerWhenPeriods.length === 0) || isFullYearAcceptable) {
        offerTempWhenPeriods = [];
    }

    const formattedEndDate = formattingDate(applicationEndDate);

    const offerWhen: UpdateAdminVacancyWhen = {
        periods: offerTempWhenPeriods,
        durationMinDays: participationPeriod[0],
        durationMaxDays: participationPeriod[1],
        applicationEndDate: formattedEndDate,
        isFullYearAcceptable,
        isApplicableAtTheEnd,
    };

    return offerWhen;
};

// OfferWhoNeeds

export const offerWhoNeedsApiAdapter = (
    whoNeedsForm: OfferWhoNeedsFields,
): UpdateAdminVacancyWhoNeeds => {
    const {
        age,
        gender,
        languages,
        receptionPlace,
        volunteerPlaces,
        additionalInfo,
        needAllLanguages,
    } = whoNeedsForm;

    return {
        ageMax: age.maxAge,
        ageMin: age.minAge,
        needAllLanguages,
        additionalInfo: additionalInfo || "",
        receptionPlace,
        languages,
        gender,
        // volunteerPlaceCount: volunteerPlaces,
    };
};

export const offerWhoNeedsAdapter = (
    whoNeeds: UpdateAdminVacancyWhoNeeds,
): OfferWhoNeedsFields => {
    const {
        needAllLanguages,
        ageMax,
        ageMin,
        gender,
        receptionPlace,
        languages,
        volunteerPlaceCount,
        additionalInfo,
    } = whoNeeds;

    return {
        age: { maxAge: ageMax, minAge: ageMin },
        gender,
        languages,
        needAllLanguages,
        receptionPlace,
        volunteerPlaces: 0, // volunteerPlaceCount,
        additionalInfo,
    };
};
