import type { Profile } from "@/entities/Profile";
import type { ProfileInfoFields } from "@/features/ProfileInfo";

export function profileFormApiAdapter(data: ProfileInfoFields): Omit<Profile, "id"> {
    return {
        email: data.contacts.email,
        locale: data.locale.language,
        city: data.locale?.city,
        country: data.locale?.country,
        aboutMe: data.aboutMe,
        gender: data.gender,
        vk: data.social?.vk,
        facebook: data.social?.facebook,
        telegram: data.social?.telegram,
        instagram: data.social?.instagram,
    };
}
