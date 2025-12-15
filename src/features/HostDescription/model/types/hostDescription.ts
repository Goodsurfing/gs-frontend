import { Image } from "@/types/media";

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
    avatar?: Image;
    mainInfo?: HostDescriptionMainInfoFields;
    type: HostDescriptionTypeFields;
    socialMedia?: HostDescriptionSocialFields;
}
