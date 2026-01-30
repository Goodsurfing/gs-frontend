import {
    AddressFormFormFields, DatePeriods, EndSettings,
    OfferDescriptionField, OfferWhenFields, TimeSettingsControls,
} from "@/features/Offer";
import {
    AdminVacancyConditions,
    AdminVacancyDescription, AdminVacancyFinishingTouches,
    AdminVacancyWhatToDo, AdminVacancyWhen, AdminVacancyWhoNeeds,
    UpdateAdminVacancyConditions,
    UpdateAdminVacancyDescription, UpdateAdminVacancyFinishingTouches,
    UpdateAdminVacancyWhatToDo, UpdateAdminVacancyWhen,
    UpdateAdminVacancyWhere, UpdateAdminVacancyWhoNeeds,
} from "../model/types/adminSchema";
import { formattingDate, parseDateApi } from "@/shared/lib/formatDate";
import { MAX_AGE_FOR_VOLUNTEER, MINIMAL_AGE_FOR_VOLUNTEER, OfferWhoNeedsFields } from "@/features/OfferWhoNeedsForm";
import { OfferWhatToDoFormFields } from "@/features/OfferWhatToDo";
import { OfferConditionsFormFields } from "@/features/OfferConditions";
import { OfferFinishingTouchesFormFields } from "@/features/OfferFinishingTouches";

// OfferWhere

export const offerWhereApiAdapter = (addressForm: AddressFormFormFields):
UpdateAdminVacancyWhere => {
    const { address } = addressForm;
    const pos = address.geoObject?.Point.pos || "";
    const [longitude, latitude] = pos.split(" ").map(Number);
    return { address: address.address, longitude, latitude };
};

// OfferWhen

export const offerWhenFormAdapter = (data: AdminVacancyWhen): OfferWhenFields => {
    const {
        periods, applicationEndDate, durationMaxDays,
        durationMinDays, isApplicableAtTheEnd, isFullYearAcceptable,
    } = data;

    const offerWhenPeriods: DatePeriods[] = periods.map((period) => ({
        start: parseDateApi(period.start ?? undefined) || new Date(),
        end: parseDateApi(period.end ?? undefined) || new Date(),
    }));

    const timeSettings: TimeSettingsControls = {
        isFullYearAcceptable: isFullYearAcceptable ?? false,
        isApplicableAtTheEnd: isApplicableAtTheEnd ?? false,
    };

    const endSettings: EndSettings = {
        applicationEndDate: parseDateApi(applicationEndDate ?? undefined),
        isWithoutApplicationDate: !applicationEndDate,
    };

    const offerWhenFields: OfferWhenFields = {
        periods: offerWhenPeriods,
        participationPeriod: durationMinDays == null || durationMaxDays == null
            ? [7, 186]
            : [durationMinDays, durationMaxDays],
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
        ageMax: age.maxAge ?? MINIMAL_AGE_FOR_VOLUNTEER,
        ageMin: age.minAge ?? MAX_AGE_FOR_VOLUNTEER,
        needAllLanguages,
        additionalInfo: additionalInfo || "",
        receptionPlace,
        languages,
        gender,
        volunteerPlaceCount: volunteerPlaces,
    };
};

export const offerWhoNeedsAdapter = (
    whoNeeds: AdminVacancyWhoNeeds,
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
        needAllLanguages: needAllLanguages ?? false,
        receptionPlace: receptionPlace ?? "any",
        volunteerPlaces: volunteerPlaceCount ?? 0,
        additionalInfo: additionalInfo ?? "",
    };
};

// OfferDescription

export const offerDescriptionApiAdapter = (
    data: OfferDescriptionField,
): UpdateAdminVacancyDescription => {
    const result: UpdateAdminVacancyDescription = {
        title: data.title,
        description: data.fullDescription,
        shortDescription: data.shortDescription,
        categoryIds: data.category,
        imageId: data.coverImage ? data.coverImage.id : null,
    };

    return result;
};

export const offerDescriptionAdapter = (
    data: AdminVacancyDescription,
): Partial<OfferDescriptionField> => {
    const {
        title, description, shortDescription, image, categoryIds,
    } = data;

    return {
        title: title ?? undefined,
        fullDescription: description ?? undefined,
        shortDescription: shortDescription ?? undefined,
        coverImage: image,
        category: categoryIds,
    };
};

// OfferWhatTodo

export const offerWhatToDoApiAdapter = (
    data: OfferWhatToDoFormFields,
): UpdateAdminVacancyWhatToDo => {
    const {
        additionalSkills, skills, workingHours, extraInfo,
    } = data;

    const { hours, dayOff, timeType } = workingHours;

    const additionalSkillsTemp = additionalSkills?.map(
        (additionalSkill) => additionalSkill.text,
    );

    return {
        skillIds: skills,
        additionalSkills: additionalSkillsTemp,
        hours,
        dayOff,
        timeType,
        externalInfo: extraInfo,
    };
};

export const offerWhatToDoAdapter = (
    data: AdminVacancyWhatToDo,
): OfferWhatToDoFormFields => {
    const {
        dayOff, hour, skillIds, timeType, additionalSkills, externalInfo,
    } = data;

    const additionalSkillsTemp = additionalSkills?.map((additionalSkill) => ({
        text: additionalSkill,
    }));

    return {
        skills: skillIds,
        additionalSkills: additionalSkillsTemp || [],
        workingHours: {
            hours: hour ?? 6,
            dayOff: dayOff ?? 2,
            timeType: timeType ?? "week",
        },
        extraInfo: externalInfo ?? "",
    };
};

// OfferConditions

export const offerConditionsApiAdapter = (
    data: OfferConditionsFormFields,
): UpdateAdminVacancyConditions => {
    const {
        housing,
        nutrition,
        travel,
        facilities,
        extraFeatures,
        payment,
        extraConditions,
    } = data;

    const { currency, contribution, reward } = payment;

    return {
        houseIds: housing.housing,
        foodIds: nutrition.nutrition,
        transferIds: travel.travel,
        conveniences: facilities.facilities,
        additionalConditions: extraConditions,
        additionalFeatures: extraFeatures.extraFeatures,
        volunteerContributions: contribution,
        volunteerRemuneration: reward,
        currency,
    };
};

export const offerConditionsAdapter = (
    offerConditions: AdminVacancyConditions,
): OfferConditionsFormFields => {
    const {
        additionalFeatures,
        conveniences,
        currency,
        volunteerContributions,
        volunteerRemuneration,
        additionalConditions,
        foodIds,
        houseIds,
        transferIds,
    } = offerConditions;

    return {
        extraConditions: additionalConditions || "",
        extraFeatures: { extraFeatures: additionalFeatures },
        facilities: { facilities: conveniences },
        housing: { switchState: true, housing: houseIds || [] },
        nutrition: { switchState: true, nutrition: foodIds || [] },
        travel: { switchState: true, travel: transferIds || [] },
        payment: {
            currency: currency ?? "RUB",
            contribution: volunteerContributions ?? 0,
            reward: volunteerRemuneration ?? 0,
        },
    };
};

// OfferFinishingTouches

export const offerFinishingTouchesApiAdapter = (
    data: OfferFinishingTouchesFormFields,
): UpdateAdminVacancyFinishingTouches => {
    const {
        extraConditions,
        onlyVerified,
        questionnaireUrl,
        questions,
        rules,
        welcomeMessage,
    } = data;
    return {
        additionalConditions: extraConditions,
        roles: rules,
        helloText: welcomeMessage,
        onlyVerified,
        questionnaireUrl,
        questions,
    };
};

export const offerFinishingTouchesAdapter = (
    offerFinishingTouches: AdminVacancyFinishingTouches,
): OfferFinishingTouchesFormFields => {
    const {
        helloText,
        onlyVerified,
        questionnaireUrl,
        questions,
        roles,
        additionalConditions,
    } = offerFinishingTouches;

    return {
        welcomeMessage: helloText ?? "",
        extraConditions: additionalConditions || [],
        onlyVerified,
        questionnaireUrl: questionnaireUrl ?? "",
        questions,
        rules: roles ?? "",
    };
};
