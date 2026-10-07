export const TARIFF_CODE = {
    VOLUNTEER: "volunteer_990",
    HOST: "host_4990",
    INTERNATIONAL: "international_5000",
} as const;

export const TARIFF_FALLBACK_PRICE_RUB = {
    [TARIFF_CODE.VOLUNTEER]: 990,
    [TARIFF_CODE.HOST]: 4990,
    [TARIFF_CODE.INTERNATIONAL]: 5000,
} as const;

export type TariffCode = typeof TARIFF_CODE[keyof typeof TARIFF_CODE];

/** Бесплатных откликов в год без членства — должно совпадать с
 * ApplicationConstant::FREE_APPLICATION_LIMIT на бэкенде (GS-168, GS-169, GS-171). */
export const FREE_APPLICATIONS_LIMIT = 3;
