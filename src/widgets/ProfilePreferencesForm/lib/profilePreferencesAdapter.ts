import { Profile, UpdateProfilePreferences } from "@/entities/Profile";
import { ProfilePreferencesField } from "../model/types/profilePreferences";

export const profilePreferencesApiAdapter = (
    data: ProfilePreferencesField,
): UpdateProfilePreferences => {
    const { favoriteCategories } = data;
    return {
        favoriteCategoryIds: favoriteCategories,
    };
};

export const profilePreferencesAdapter = (
    data: Profile,
): ProfilePreferencesField => {
    const { favoriteCategories } = data;
    return {
        favoriteCategories,
    };
};
