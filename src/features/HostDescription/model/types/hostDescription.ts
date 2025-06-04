export type OrganizationType = "ООО" | "ООПТ" | "ОАО" | "ИП" | "Другое";

export type HostDescriptionTypeFields = {
    organizationType: OrganizationType;
    otherOrganizationType: string;
};

export type HostDescriptionMainInfoFields = {
    organization?: string;
    shortOrganization?: string;
    website?: string;
    aboutInfo?: string;
};

export type HostDescriptionSocialFields = {
    vk?: string;
    instagram?: string;
    facebook?: string;
    telegram?: string;
};

export interface HostDescriptionFormFields {
    address?: string;
    avatar?: string;
    mainInfo?: HostDescriptionMainInfoFields;
    type: HostDescriptionTypeFields;
    socialMedia?: HostDescriptionSocialFields;
}
