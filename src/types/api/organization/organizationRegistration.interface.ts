export interface IOrganizationRegistrationData {
    name: string;
    address: string;
    type: string;
    description: string;
    website: string;
    vk: string;
    facebook: string;
    telegram: string;
    instagram: string;
}

export interface IOrganizationRegistrationResponse {
    id: string;
    name: string;
    description: string;
}
