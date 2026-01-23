import { AddressFormFormFields } from "@/features/Offer";
import { UpdateAdminVacancyWhere } from "../model/types/adminSchema";

export const offerWhereApiAdapter = (addressForm: AddressFormFormFields):
UpdateAdminVacancyWhere => {
    const { address } = addressForm;
    const pos = address.geoObject?.Point.pos || "";
    const [longitude, latitude] = pos.split(" ").map(Number);
    return { address: address.address, longitude, latitude };
};
