const NUMBER_LOCALE: Record<string, string> = { ru: "ru-RU", en: "en-US", es: "es-ES" };

/** Число с разделителем разрядов: 23663 → «23 663» (en — «23,663») */
export const formatStatNumber = (value: number, locale: string): string => (
    new Intl.NumberFormat(NUMBER_LOCALE[locale] ?? "ru-RU").format(value)
);

/**
 * «С нами уже более N…»: вниз до тысяч от 10 000 (23 663 → 23 000), до сотен
 * ниже (1 706 → 1 700) — иначе 1 706 проектов превращались в «1 000».
 */
export const roundStat = (value: number): number => (
    value >= 10000 ? Math.floor(value / 1000) * 1000 : Math.floor(value / 100) * 100
);
