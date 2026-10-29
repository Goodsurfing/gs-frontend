/** Вакансия на карте — компактно, только то, что нужно отметке и карточке. */
export interface MapOffer {
    id: number;
    name: string;
    lat: number;
    lng: number;
    /** Превью для карточки (medium) и для списка кластера (small) */
    image?: string;
    imageSmall?: string;
    category?: { name: string; color: string };
}
