import { ProfilePreferencesField } from "../model/types/profilePreferences";
import { Profile, UpdateProfilePreferences } from "@/entities/Profile";

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
