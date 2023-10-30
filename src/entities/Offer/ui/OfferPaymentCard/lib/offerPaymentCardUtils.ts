import { Currency } from "@/entities/Offer/model/types/offerConditions";

export const combineToFullPayment = (money: number, currency: Currency) => {
    const currencyList: Record<Currency, string> = {
        EUR: "€",
        RUB: "₽",
        USD: "$",
    };
    return `${money} ${currencyList[currency]}`;
};
