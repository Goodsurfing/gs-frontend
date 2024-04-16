type SortValue = "urgency" | "popularity" | "novelty";

interface SortOffers {
    label: string;
    value: SortValue;
}

export const sortOffers: SortOffers[] = [
    { label: "По срочности", value: "urgency" },
    { label: "По популярности ", value: "popularity" },
    { label: "По новизне", value: "novelty" },
];
