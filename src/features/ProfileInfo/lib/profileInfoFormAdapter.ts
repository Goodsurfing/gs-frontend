import type { Locale } from "@/entities/Locale";
import type { Profile } from "@/entities/Profile";
import { ProfileInfoFields } from "../model/types/profileInfo";

export function profileInfoFormAdapter(profileData?: Profile): ProfileInfoFields {
    return {
        about: {
            firstName: profileData?.firstName,
            lastName: profileData?.lastName,
        },
        social: {
            facebook: profileData?.facebook,
            instagram: profileData?.instagram,
            telegram: profileData?.telegram,
            vk: profileData?.vk,
        },
        gender: profileData?.gender,
        locale: {
            language: profileData?.locale as unknown as Locale, // backend issue. todo
            city: profileData?.city,
            country: profileData?.country,
        },
        profileAvatar: profileData?.imageUuid,
        aboutMe: profileData?.aboutMe,
    };
}
