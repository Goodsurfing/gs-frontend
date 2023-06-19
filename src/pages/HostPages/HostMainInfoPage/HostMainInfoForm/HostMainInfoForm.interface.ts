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

export interface YMapWithAddressForm extends Pick<IHostInfoForm, 'address'> {}
export interface IHostMainInfoOrganizationForm extends Pick<IHostInfoForm, 'name' | 'description' | 'type' | 'website'> {}
export interface IHostMainInfoSocialForm extends Pick<IHostInfoForm, 'vk' | 'telegram' | 'instagram' | 'facebook'> {}
