export const TARIFF_CODE = {
    VOLUNTEER: "volunteer_990",
    HOST: "host_4990",
} as const;

export const TARIFF_FALLBACK_PRICE_RUB = {
    [TARIFF_CODE.VOLUNTEER]: 990,
    [TARIFF_CODE.HOST]: 4990,
} as const;

export type TariffCode = typeof TARIFF_CODE[keyof typeof TARIFF_CODE];
