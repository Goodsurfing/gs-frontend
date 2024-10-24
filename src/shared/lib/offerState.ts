import { FormApplicationStatus } from "@/entities/Application";

interface OfferStateType {
    label: FormApplicationStatus;
    color: string
}

const offerStateColors: OfferStateType[] = [
    {
        label: "new",
        color: "#79C8FF",
    },
    {
        label: "accepted",
        color: "#77EB98",
    },
    {
        label: "canceled",
        color: "#FCC3C3",
    },
];

export const getOfferStateColor = (label: FormApplicationStatus) => {
    const item = offerStateColors.find((offerState) => offerState.label === label);
    return item ? item.color : "";
};
