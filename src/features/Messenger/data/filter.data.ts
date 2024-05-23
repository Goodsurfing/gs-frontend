import { OfferState } from "@/entities/Offer";

export type FilterValue = OfferState | "communication" | "archive" | null;

interface FilterData {
    text: string;
    color?: string;
    value: FilterValue
}

export const filterData: FilterData[] = [
    {
        text: "Новые",
        color: "#79C8FF",
        value: "new",
    },
    {
        text: "Подтвержденные",
        color: "#5EECD2",
        value: "confirmed",
    },
    {
        text: "Принятые",
        color: "#77EB98",
        value: "accepted",
    },
    {
        text: "Отклоненные",
        color: "#FCC3C3",
        value: "rejected",
    },
    {
        text: "Общение",
        value: "communication",
    },
    {
        text: "Архив",
        value: "archive",
    },
];
