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

export const hostDescriptionApiAdapter = (data: HostDescriptionFormFields): Partial<Host> => {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        address, avatar, mainInfo, socialMedia, type,
    } = data;
    return {
        name: mainInfo?.organization,
        type: type?.organizationType,
        description: mainInfo?.shortOrganization,
        address,
        // wip backend avatar,
        ...socialMedia,
    };
};
