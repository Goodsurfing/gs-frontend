import { VolunteerApi, VolunteerType } from "@/entities/Volunteer";
import { ProfilePreferencesField } from "../model/types/profilePreferences";

export const profilePreferencesApiAdapter = (
    data: ProfilePreferencesField,
): Partial<VolunteerType> => {
    const { favoriteCategories } = data;
    return {
        favoriteCategories,
    };
};

export const profilePreferencesAdapter = (
    data: VolunteerApi,
): ProfilePreferencesField => {
    const { favoriteCategories } = data;
    return {
        favoriteCategories,
    };
};
