import * as z from "zod";

export const addressFormSchema = z.object({
    address: z.string().min(0, { message: "Адресс слишком короткий" }).trim(),
});

export interface AddressFormFormFields {
    address: string;
}
