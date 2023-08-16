export type OrganizationType = "ООО" | "ООПТ" | "ОАО" | "ИП";

export type HostDescriptionTypeFields = {
    organizationType?: string;
    otherOrganizationType?: string;
};

export type HostDescriptionExtraInfoFields = {
    website?: string;
    aboutInfo: string;
};

export type HostDescriptionMainInfoFields = {
    organization: string;
    shortOrganization: string;
};

export type HostDescriptionSocialFields = {
    vk?: string;
    instagram?: string;
    facebook?: string;
    telegram?: string;
};

export interface HostDescriptionFormFields {
    address: string;
    avatar: string;
    type: HostDescriptionTypeFields;
    mainInfo: HostDescriptionMainInfoFields;
    socicalMedia: HostDescriptionSocialFields;
}
