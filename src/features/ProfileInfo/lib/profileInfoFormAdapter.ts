import type { Locale } from "@/entities/Locale";
import type { Profile } from "@/entities/Profile";
import { ProfileInfoFields, ProfileDateOfBirth } from "../model/types/profileInfo";

export function profileInfoFormAdapter(profileData?: Profile): ProfileInfoFields {
    const date = new Date(profileData?.birthDate ?? "");
    const birthDate: ProfileDateOfBirth = {
        day: date.getUTCDate(),
        mounth: date.getUTCMonth() + 1,
        year: date.getUTCFullYear(),
    };

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
        contacts: {
            email: profileData?.email,
            phone: profileData?.phone,
        },
        gender: profileData?.gender,
        locale: {
            language: profileData?.locale as unknown as Locale, // backend issue. todo
            city: profileData?.city,
            country: profileData?.country,
        },
        profileAvatar: profileData?.image,
        aboutMe: profileData?.aboutMe,
        birthDate,
    };
}
