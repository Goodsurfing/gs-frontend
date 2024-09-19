import type { ProfileApi } from "@/entities/Profile";
import type { ProfileInfoFields } from "../model/types/profileInfo";

export function profileFormApiAdapter(data: ProfileInfoFields): Partial<Omit<ProfileApi, "id">> {
    let birthDate: string | undefined;
    if (data.birthDate && data.birthDate.year && data.birthDate.mounth && data.birthDate.day) {
        const tempBirthDate = new Date(
            data.birthDate.year,
            data.birthDate.mounth - 1,
            data.birthDate.day,
        );
        birthDate = tempBirthDate.toLocaleDateString();
    }
    return {
        locale: data.locale.language!,
        firstName: data.about?.firstName,
        lastName: data.about?.lastName,
        birthDate,
        phone: data.contacts?.phone,
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
