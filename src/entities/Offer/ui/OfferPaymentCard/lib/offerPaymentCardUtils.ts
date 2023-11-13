import { Currency } from "@/entities/Offer/model/types/offerConditions";
import { paymentValues } from "@/features/OfferConditions/model/data/payment";

export const combineToFullPayment = (money: number, currency: Currency) => {
    const currencyResult = paymentValues.find((item) => item.name === currency);
    return `${money} ${currencyResult?.symbol}`;
};
