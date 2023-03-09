export enum OrganizationApiEndpoints {
    REGISTER = '/organization/',
    GET_ALL = '/select/',
}

export interface IOrganizationRegistrationData {
    name: string;
    description: string;
}