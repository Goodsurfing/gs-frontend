import { Currency } from "@/entities/Offer";

export type CurrencyCharacter = Readonly<"₽" | "$" | "€">;

type PaymentValues = {
    readonly symbol: CurrencyCharacter;
    readonly name: Currency;
};

export const paymentValues: Readonly<PaymentValues[]> = [{
    name: "RUB",
    symbol: "₽",
}, {
    name: "USD",
    symbol: "$",
}, {
    name: "EUR",
    symbol: "€",
}] as const;
