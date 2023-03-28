export interface IHostInfoForm {
  name: string;
  address: string;
  description: string;
  facebook: string;
  instagram: string;
  vk: string;
  telegram: string;
  website: string;
  type: string;
  otherType: string;
  organizationFullDescription: string;
}

export interface YMapWithAddress extends Pick<IHostInfoForm, "address"> {};
export interface IHostMainInfoOrganization extends Pick<IHostInfoForm, "name" | "description" | "type" | "otherType"> {};
export interface IHostMainInfoSocial extends Pick<IHostInfoForm, "address"> {};
