export interface Organization {
  id: string;
  name: string;
}

export interface OrganizationSchema {
  authData?: Organization;
}
