export enum OrganizationApiEndpoints {
    REGISTER = '/organization/',
    UPDATE = '/organization/',
    JOIN = '/join/',
    GET_ALL = '/select/',
}

export interface OrganizationType {
    name: string;
    address: string;
    type: string;
    website: string;
    description: string;
    vk: string;
    facebook: string;
    telegram: string;
    instagram: string;
}

export interface OrganizationResponseType {
    id: string;
    name: string;
    address: string;
    type: string;
    website: string;
    description: string;
    vk: string;
    facebook: string;
    telegram: string;
    instagram: string;
}
