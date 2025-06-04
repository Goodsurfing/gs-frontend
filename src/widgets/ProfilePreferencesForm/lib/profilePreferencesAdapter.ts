import { ProfilePreferencesField } from "../model/types/profilePreferences";
import { Profile, ProfileApi } from "@/entities/Profile";

export const profilePreferencesApiAdapter = (
    data: ProfilePreferencesField,
): Partial<ProfileApi> => {
    const { favoriteCategories } = data;
    return {
        favoriteCategories,
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
