import { Host } from "@/entities/Host";
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
    const hostTypeFields: HostDescriptionTypeFields = {};
    if (isOrganizationType(data.type)) {
        hostTypeFields.organizationType = data.type;
    } else {
        hostTypeFields.otherOrganizationType = data.type;
    }

    const hostInfoFields: HostDescriptionMainInfoFields = {
        aboutInfo: data.description,
        organization: data.name,
        website: data.website,
    };

    const hostSocialFields: HostDescriptionSocialFields = {
        facebook: data.facebook,
        instagram: data.instagram,
        telegram: data.telegram,
        vk: data.telegram,
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
    formData.append("name", mainInfo?.organization || "");
    formData.append("address", "test");
    formData.append("type", type?.organizationType || "");
    formData.append("website", mainInfo?.website || "");
    formData.append("description", mainInfo?.aboutInfo || "");
    formData.append("vk", socialMedia?.vk || "");
    formData.append("facebook", socialMedia?.facebook || "");
    formData.append("instagram", socialMedia?.instagram || "");
    formData.append("telegram", socialMedia?.telegram || "");
    return formData;
};

export const hostDescriptionApiAdapterUpdate = (data: HostDescriptionFormFields): Partial<Host> => {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        address, avatar, mainInfo, socialMedia, type,
    } = data;
    return {
        name: mainInfo?.organization,
        type: type?.organizationType,
        description: mainInfo?.aboutInfo,
        // wip backend avatar,
        vk: socialMedia?.vk,
        instagram: socialMedia?.instagram,
        facebook: socialMedia?.facebook,
        telegram: socialMedia?.telegram,
        website: mainInfo?.website,
    };
};
