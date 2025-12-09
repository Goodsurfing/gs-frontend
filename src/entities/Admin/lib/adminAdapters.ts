import { getFullName } from "@/shared/lib/getFullName";
import {
    AdminOrganizationsFields, AdminUser, AdminUsers, AdminUsersFields,
} from "../model/types/adminSchema";
import { Host } from "@/entities/Host";
import { Profile } from "@/entities/Profile";
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

    console.log("birthData", birthDate);
    console.log("Data", new Date(data?.birthDate ?? ""));

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
        birthDate: {
            day: 0,
            mounth: 7,
            year: 2001,
        },
        gender,
        profileAvatar: undefined,
    };
};

export const adminOrganizationsAdapter = (data: Host[]): AdminOrganizationsFields[] => {
    const result: AdminOrganizationsFields[] = data.map((user) => {
        const {
            id, name, owner,
        } = user;
        return {
            id,
            name,
            owner: getFullName(owner.firstName, owner.lastName),
            countMembers: 1,
            countVacancies: 4,
            countVolunteers: 6,
            isBlock: false,
        };
    });

    return result;
};
