import { z, ZodSchema } from "zod";
import { GeoObject } from "@/entities/Map";

// export const addressFormSchema: ZodSchema<AddressFormFormFields> = z.object({
//     address: z.object({
//         address: z.string().min(0, { message: "Адресс слишком короткий" }).trim(),
//         geoObject: z.nullable(GeoObject),
//     }),
// });

export interface AddressFormInput {
    address: string;
    geoObject: GeoObject | null
}

export interface AddressFormFormFields {
    address: AddressFormInput;
}
