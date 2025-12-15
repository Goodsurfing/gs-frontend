import type { Profile } from "@/entities/Profile";
import { ProfileInfoFields } from "../model/types/profileInfo";
import { parseDate } from "@/shared/lib/formatDate";

export function profileInfoFormAdapter(data: Profile): ProfileInfoFields {
    const {
        firstName, lastName, facebook, instagram, telegram,
        vk, email, phone, gender, locale, city, country, image,
        aboutMe, birthDate,
    } = data;
    const birthDateTemp = birthDate ? parseDate(birthDate) : undefined;

    return {
        about: {
            firstName: firstName ?? undefined,
            lastName: lastName ?? undefined,
        },
        social: {
            facebook: facebook ?? undefined,
            instagram: instagram ?? undefined,
            telegram: telegram ?? undefined,
            vk: vk ?? undefined,
        },
        contacts: {
            email: email ?? undefined,
            phone: phone ?? undefined,
        },
        gender: gender ?? undefined,
        locale: {
            language: locale,
            city: city ?? undefined,
            country: country ?? undefined,
        },
        profileAvatar: image ?? undefined,
        aboutMe: aboutMe ?? undefined,
        birthDate: birthDateTemp,
    };
}
