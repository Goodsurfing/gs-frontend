import { IOrganizationRegistrationData } from "./organizationRegistration.interface";

export interface IOrganizationBuildData extends IOrganizationRegistrationData {
  uuid: string;
}