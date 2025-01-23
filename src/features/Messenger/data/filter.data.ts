import { FormApplicationStatus } from "@/entities/Application";

export type FilterValue = FormApplicationStatus | "communication" | "archive" | null;

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
        text: "Принятые",
        color: "#77EB98",
        value: "accepted",
    },
    {
        text: "Отклоненные",
        color: "#FCC3C3",
        value: "canceled",
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
