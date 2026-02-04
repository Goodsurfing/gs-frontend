import { getFullName } from "@/shared/lib/getFullName";
import {
    AdminOrganization,
    AdminOrganizations,
    AdminOrganizationsFields, AdminUser, AdminUserFields, AdminUsers, AdminUsersFields,
    UpdateAdminOrganization,
    UpdateAdminUser,
} from "../model/types/adminSchema";
import { parseDate } from "@/shared/lib/formatDate";
import { HostDescriptionFormFields } from "@/features/HostDescription";
import {
    HostDescriptionMainInfoFields, HostDescriptionSocialFields,
    HostDescriptionTypeFields, OrganizationType,
} from "@/features/HostDescription/model/types/hostDescription";

export const adminUsersAdapter = (data?: AdminUsers[]): AdminUsersFields[] => {
    if (!data) return [];
    const result: AdminUsersFields[] = data.map((user) => {
        const {
            id, email, firstName, lastName, created,
            lastVisit, endPayment, isActive, isPayment,
            isVolunteer, isOrganization,
        } = user;
        return {
            id,
            name: getFullName(firstName, lastName),
            email,
            isActive,
            isConfirmed: true,
            isHost: isOrganization,
            isMembership: isPayment,
            isVolunteer,
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
            firstName: firstName ?? undefined,
            lastName: lastName ?? undefined,
        },
        aboutMe: aboutMe ?? undefined,
        locale: {
            city: city ?? undefined,
            country: country ?? undefined,
            language: locale,
        },
        contacts: {
            email,
            phone: phone ?? undefined,
        },
        social: {
            vk: vk ?? undefined,
            telegram: telegram ?? undefined,
            facebook: facebook ?? undefined,
            instagram: instagram ?? undefined,
        },
        birthDate: birthDateTemp,
        gender: gender ?? undefined,
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
        phone: contacts.phone ?? null,
        city: locale.city ?? null,
        country: locale.country ?? null,
        aboutMe: aboutMe ?? null,
        gender: gender ?? null,
        vk: social.vk ?? null,
        facebook: social.facebook ?? null,
        telegram: social.telegram ?? null,
        instagram: social.instagram ?? null,
        firstName: about.firstName ?? null,
        lastName: about.lastName ?? null,
        imageId: profileAvatar?.id ?? null,
        skillIds: [],
        additionalSkills: [],
        achievementIds: [],
    };
};

export const adminUpdateUserAdapter = (data: Omit<AdminUser, "skills"> & { skillsIds: number[] }): UpdateAdminUser => ({
    achievementIds: data.achievements.map((a) => a.id),
    skillIds: data.skillsIds,
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
    const result: AdminOrganizationsFields[] = data.map((host) => {
        const {
            id, name, firstName, lastName, countApplications, countVacancies,
            isActive,
        } = host;
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

const organizationType: readonly OrganizationType[] = ["ИП", "ОАО", "ООО", "ООПТ"] as const;
const isOrganizationType = (x: any): x is OrganizationType => organizationType.includes(x);

export const adminOrganizationAdapter = (data: AdminOrganization): HostDescriptionFormFields => {
    const hostTypeFields: HostDescriptionTypeFields = {
        organizationType: "ИП",
        otherOrganizationType: "",
    };
    if (isOrganizationType(data.type)) {
        hostTypeFields.organizationType = data.type;
    } else {
        hostTypeFields.organizationType = "Другое";
        hostTypeFields.otherOrganizationType = data.type;
    }

    const hostInfoFields: HostDescriptionMainInfoFields = {
        aboutInfo: data.description,
        shortOrganization: data.shortDescription,
        organization: data.name,
        website: data.website,
    };

    const hostSocialFields: HostDescriptionSocialFields = {
        facebook: data.facebook,
        instagram: data.instagram,
        telegram: data.telegram,
        vk: data.vk,
    };

    return {
        mainInfo: hostInfoFields,
        type: hostTypeFields,
        socialMedia: hostSocialFields,
        address: data.address,
        avatar: data?.image ? {
            id: data.image.id,
            contentUrl: data.image.contentUrl,
            thumbnails: data.image.thumbnails,
        } : undefined,
    };
};

export const adminOrganizationApiAdapter = (
    data: HostDescriptionFormFields,
): UpdateAdminOrganization => {
    const {
        address, avatar, mainInfo, socialMedia, type,
    } = data;
    const formType = type.organizationType === "Другое" ? type.otherOrganizationType : type.organizationType;
    return {
        name: mainInfo?.organization ?? "",
        address: address ?? "",
        type: formType,
        description: mainInfo?.aboutInfo ?? "",
        shortDescription: mainInfo?.shortOrganization ?? "",
        imageId: avatar?.id ?? null,
        vk: socialMedia?.vk ?? "",
        instagram: socialMedia?.instagram ?? "",
        facebook: socialMedia?.facebook ?? "",
        telegram: socialMedia?.telegram ?? "",
        website: mainInfo?.website ?? "",
        otherType: type.otherOrganizationType,
    };
};
