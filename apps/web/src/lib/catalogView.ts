/**
 * Вкладка каталога на телефоне — в адресе (?view=map), чтобы ссылка и «назад»
 * со страницы вакансии открывали то же. По умолчанию — список: Яндекс.Карты
 * (≈700 КБ по сети, 3 МБ скрипта) грузятся только по кнопке «Карта».
 */
export type CatalogView = "list" | "map";

export function parseCatalogView(raw: string | string[] | undefined): CatalogView {
    return raw === "map" ? "map" : "list";
}

/** Строка запроса (с «?» или без) с нужной вкладкой; список — без параметра */
export function withCatalogView(search: string, view: CatalogView): string {
    const query = new URLSearchParams(search);
    if (view === "map") query.set("view", "map");
    else query.delete("view");
    const result = query.toString();
    return result ? `?${result}` : "";
}
