import { IOrganizationRegistrationFormData } from "./organizationRegistration.interface";

export interface IOrganizationBuildData extends IOrganizationRegistrationFormData {
  uuid: string;
}