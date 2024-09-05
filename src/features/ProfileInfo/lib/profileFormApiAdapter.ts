import type { Profile } from "@/entities/Profile";
import type { ProfileInfoFields } from "../model/types/profileInfo";

export function profileFormApiAdapter(data: ProfileInfoFields): Partial<Omit<Profile, "id">> {
    return {
        email: data.contacts.email!,
        locale: data.locale.language!,
        firstName: data.about?.firstName,
        lastName: data.about?.lastName,
        phone: `${data.contacts?.phone}`,
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
