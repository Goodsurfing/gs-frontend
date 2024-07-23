import { GeoObject } from "@/entities/Map";

export interface AddressFormInput {
    address: string;
    geoObject: GeoObject | null
}

export interface AddressFormFormFields {
    address: AddressFormInput;
}
