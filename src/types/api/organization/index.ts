export enum OrganizationApiEndpoints {
    REGISTER = '/organization/',
    JOIN = '/join/',
    GET_ALL = '/select/',
}

export interface IOrganizationRegistrationData {
    name: string;
    description: string;
}