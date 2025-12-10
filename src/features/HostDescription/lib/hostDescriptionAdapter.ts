import { Host, HostApi } from "@/entities/Host";
import {
    HostDescriptionFormFields,
    HostDescriptionMainInfoFields,
    HostDescriptionSocialFields,
    HostDescriptionTypeFields,
    OrganizationType,
} from "../model/types/hostDescription";

const organizationType: readonly OrganizationType[] = ["ИП", "ОАО", "ООО", "ООПТ"] as const;

const isOrganizationType = (x: any): x is OrganizationType => organizationType.includes(x);

export const hostDescriptionFormAdapter = (data?: Host): Partial<HostDescriptionFormFields> => {
    if (!data) {
        return {};
    }
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
    };
};

export const hostDescriptionApiAdapterCreate = (data: HostDescriptionFormFields): FormData => {
    const {
        mainInfo, socialMedia, type,
    } = data;
    const formData = new FormData();
    const videoGallery: string[] = [];
    const formType = type.organizationType === "Другое" ? type.otherOrganizationType : type.organizationType;

    formData.append("isActive", "true");
    formData.append("address", "test");
    formData.append("name", mainInfo?.organization || "");
    formData.append("address", "test");
    formData.append("type", formType);
    formData.append("website", mainInfo?.website || "");
    formData.append("description", mainInfo?.aboutInfo || "");
    formData.append("shortDescription", mainInfo?.shortOrganization || "");
    formData.append("vk", socialMedia?.vk || "");
    formData.append("facebook", socialMedia?.facebook || "");
    formData.append("instagram", socialMedia?.instagram || "");
    formData.append("telegram", socialMedia?.telegram || "");
    formData.append("videoGallery", JSON.stringify(videoGallery));
    return formData;
};

export const hostDescriptionApiAdapterUpdate = (
    data: HostDescriptionFormFields,
): Partial<HostApi> => {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        address, avatar, mainInfo, socialMedia, type,
    } = data;
    const formType = type.organizationType === "Другое" ? type.otherOrganizationType : type.organizationType;
    return {
        name: mainInfo?.organization,
        type: formType,
        description: mainInfo?.aboutInfo,
        shortDescription: mainInfo?.shortOrganization,
        avatar,
        vk: socialMedia?.vk,
        instagram: socialMedia?.instagram,
        facebook: socialMedia?.facebook,
        telegram: socialMedia?.telegram,
        website: mainInfo?.website,
    };
};
