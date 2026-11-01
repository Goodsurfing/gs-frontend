/** Точка на карте (вакансия или сбор) — компактно, только то, что нужно отметке и карточке. */
export interface MapOffer {
    /** У вакансий — число, у сборов — uuid */
    id: number | string;
    name: string;
    lat: number;
    lng: number;
    /** Превью для карточки (medium) и для списка кластера (small) */
    image?: string;
    imageSmall?: string;
    category?: { name: string; color: string };
}
