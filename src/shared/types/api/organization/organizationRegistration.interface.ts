import { OrganizationType } from ".";

export interface IOrganizationRegistrationParams extends OrganizationType {}

export interface IOrganizationRegistrationResponse {
    id: string;
    name: string;
    description: string;
    address: string;
    vk: string;
    instagram: string;
    facebook: string;
    telegram: string;
    type: string;
    website: string;
}
