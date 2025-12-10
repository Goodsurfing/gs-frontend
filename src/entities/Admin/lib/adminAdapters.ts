import { getFullName } from "@/shared/lib/getFullName";
import {
    AdminOrganizations,
    AdminOrganizationsFields, AdminUser, AdminUsers, AdminUsersFields,
    UpdateAdminUser,
} from "../model/types/adminSchema";
import { ProfileInfoFields } from "@/features/ProfileInfo";

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

export const adminUserAdapter = (data: AdminUser): ProfileInfoFields => {
    const {
        firstName, lastName, email, aboutMe, city, country, locale, phone,
        vk, telegram, facebook, instagram, birthDate, gender,
    } = data;

    const date = new Date(birthDate ?? "");
    const birthDateTemp = {
        day: date.getUTCDate(),
        mounth: date.getUTCMonth() + 1,
        year: date.getUTCFullYear(),
    };

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
        profileAvatar: undefined,
    };
};

export const adminUserApiAdapter = (data: ProfileInfoFields, imageId?: string): UpdateAdminUser => {
    const {
        about, contacts, locale, social, aboutMe, birthDate, gender,
    } = data;

    let birthDateResult: string | undefined;

    if (birthDate && birthDate.year && birthDate.mounth && birthDate.day) {
        const tempBirthDate = new Date(
            birthDate.year,
            birthDate.mounth - 1,
            birthDate.day,
        );
        birthDateResult = tempBirthDate.toLocaleDateString();
    }

    return {
        locale: locale.language!,
        birthDate: birthDateResult,
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
        imageId,
    };
};

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
