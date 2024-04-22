import { OfferWhere } from "@/entities/Offer";
import { AddressFormFormFields } from "../model/types/addressForm";

export const addressFormApiAdapter = (addressForm: AddressFormFormFields): OfferWhere => {
    const { address } = addressForm;
    return { address: address.address };
};
