import type { Profile, UpdateProfile } from "@/entities/Profile";
import type { ProfileInfoFields } from "../model/types/profileInfo";

export function profileFormApiAdapter(data: ProfileInfoFields): UpdateProfile {
    const {
        about, locale, birthDate, contacts, social, aboutMe,
        gender, profileAvatar,
    } = data;
    let birthDateResult: string | undefined;

    if (birthDate && birthDate.year && birthDate.mounth && birthDate.day) {
        const { year, mounth, day } = birthDate;

        const formattedDay = String(day).padStart(2, "0");
        const formattedMonth = String(mounth).padStart(2, "0");

        birthDateResult = `${formattedDay}.${formattedMonth}.${year}`;
    }
    return {
        locale: locale.language!,
        firstName: about?.firstName ?? null,
        lastName: about?.lastName ?? null,
        birthDate: birthDateResult ?? null,
        phone: contacts?.phone ?? null,
        city: locale?.city ?? null,
        country: locale?.country ?? null,
        aboutMe: aboutMe ?? null,
        gender: gender ?? null,
        vk: data.social?.vk ?? null,
        facebook: social?.facebook ?? null,
        telegram: social?.telegram ?? null,
        instagram: social?.instagram ?? null,
        imageId: profileAvatar?.id ?? null,
    };
}

export function updateProfileDataAdapter(data: Profile): UpdateProfile {
    const {
        firstName, lastName, locale, phone,
        aboutMe, birthDate, city, country,
        gender, image, facebook, instagram,
        telegram, vk,
    } = data;
    return {
        firstName,
        lastName,
        locale,
        phone,
        aboutMe,
        birthDate,
        city,
        country,
        gender,
        imageId: image?.id ?? null,
        facebook,
        instagram,
        telegram,
        vk,
    };
}
