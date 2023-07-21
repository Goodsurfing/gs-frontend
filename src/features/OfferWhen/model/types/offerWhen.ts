import { OfferWhen } from "@/entities/Offer";
import { OfferWhenPeriods } from "@/entities/Offer";

export interface CreateOfferWhen {
    data: OfferWhen;
}

export type DatePeriods = { from: Date, to: Date };

export type OfferWhenFields = Omit<OfferWhen, "periods"> & { periods: DatePeriods[] };
