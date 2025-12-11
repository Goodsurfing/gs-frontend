import { getFullName } from "@/shared/lib/getFullName";
import {
    AdminOrganizations,
    AdminOrganizationsFields, AdminUser, AdminUserFields, AdminUsers, AdminUsersFields,
    UpdateAdminUser,
} from "../model/types/adminSchema";
import { parseDate } from "@/shared/lib/formatDate";

export const adminUsersAdapter = (data?: AdminUsers[]): AdminUsersFields[] => {
    if (!data) return [];
    const result: AdminUsersFields[] = data.map((user) => {
        const {
            id, email, firstName, lastName, created,
            lastVisit, endPayment, isActive, isPayment,
            isSkill, isOrganization,
        } = user;
        return {
            id,
            name: getFullName(firstName, lastName),
            email,
            isActive,
            isConfirmed: true,
            isHost: isOrganization,
            isMembership: isPayment,
            isVolunteer: isSkill,
            dateLogin: lastVisit,
            dateRegistration: created,
            dataEndMembership: endPayment,
        };
    });

    return result;
};

export const adminUserAdapter = (data: AdminUser): AdminUserFields => {
    const {
        firstName, lastName, email, aboutMe, city, country, locale, phone,
        vk, telegram, facebook, instagram, birthDate, gender, image,
    } = data;

    const birthDateTemp = birthDate ? parseDate(birthDate) : undefined;

    return {
        about: {
            firstName,
            lastName,
        },
        aboutMe,
        locale: {
            city,
            country,
            language: locale,
        },
        contacts: {
            email,
            phone,
        },
        social: {
            vk,
            telegram,
            facebook,
            instagram,
        },
        birthDate: birthDateTemp,
        gender,
        profileAvatar: image ? {
            id: image.id,
            imagePath: image.contentUrl,
        } : undefined,
    };
};

export const adminUserApiAdapter = (data: AdminUserFields): UpdateAdminUser => {
    const {
        about, contacts, locale, social, aboutMe, birthDate, gender, profileAvatar,
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
        birthDate: birthDateResult ?? null,
        phone: contacts.phone ?? "",
        city: locale.city ?? "",
        country: locale.country ?? "",
        aboutMe: aboutMe ?? "",
        gender,
        vk: social.vk ?? "",
        facebook: social.facebook ?? "",
        telegram: social.telegram ?? "",
        instagram: social.instagram ?? "",
        firstName: about.firstName ?? "",
        lastName: about.lastName ?? "",
        imageId: profileAvatar?.id ?? null,
        skillIds: [],
        additionalSkills: [],
        achievementIds: [],
    };
};

export const adminUpdateUserAdapter = (data: AdminUser): UpdateAdminUser => ({
    achievementIds: data.achievements.map((a) => a.id),
    skillIds: data.skills?.map((s) => s.id) ?? [],
    additionalSkills: data.additionalSkills,
    imageId: data.image?.id ?? null,

    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    birthDate: data.birthDate,
    gender: data.gender ?? "male",
    country: data.country ?? "",
    city: data.city ?? "",
    locale: data.locale,
    phone: data.phone ?? "",
    aboutMe: data.aboutMe ?? "",
    vk: data.vk ?? "",
    facebook: data.facebook ?? "",
    instagram: data.instagram ?? "",
    telegram: data.telegram ?? "",
});

export const adminOrganizationsAdapter = (data: AdminOrganizations[]):
AdminOrganizationsFields[] => {
    const result: AdminOrganizationsFields[] = data.map((user) => {
        const {
            id, name, firstName, lastName, countApplications, countVacancies,
            isActive,
        } = user;
        return {
            id,
            name,
            owner: getFullName(firstName, lastName),
            countMembers: 1,
            countApplications,
            countVacancies,
            isActive,
        };
    });

    return result;
};
