import { OfferWhere } from "@/entities/Offer";
import { AddressFormFormFields } from "../model/types/addressForm";

export const addressFormApiAdapter = (addressForm: AddressFormFormFields): OfferWhere => {
    const { address } = addressForm;
    const pos = address.geoObject?.Point.pos || "";
    const [longitude, latitude] = pos.split(" ").map(Number);
    return { address: address.address, longitude, latitude };
};
