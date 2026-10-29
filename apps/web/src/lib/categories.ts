import type { Translate } from "@/i18n/dictionary";

// Названия категорий из API (на русском) → ключи словаря category-offer.* (как useCategories старого фронта)
const KNOWN = new Set([
    "Работа в хостеле", "Заповедники и парки", "Заповедники и нац. парки", "Работа на ферме",
    "Работа с животными", "Преподавание", "Работа с детьми", "Благотворительность", "Спорт",
    "Искусство", "Археология", "Онлайн", "Оплачиваемая работа", "Международные", "Другое",
]);

/** Название категории на языке страницы; неизвестную (заведена в админке позже) — как есть. */
export function categoryName(name: string | undefined, t: Translate): string | undefined {
    if (!name) return undefined;
    const trimmed = name.trim();
    return KNOWN.has(trimmed) ? t(`category-offer.${trimmed}`) : trimmed;
}
