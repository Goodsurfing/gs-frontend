import { OfferWhen } from "@/entities/Offer";

export interface CreateOfferWhen {
    data: OfferWhen;
}

export type DatePeriods = { start: Date, end: Date };

export type OfferWhenFields = Omit<OfferWhen, "periods"> & { periods: DatePeriods[] };
