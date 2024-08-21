import { OfferState } from "@/entities/Offer";

interface OfferStateType {
    label: OfferState;
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

export const getOfferStateColor = (label: OfferState) => {
    const item = offerStateColors.find((offerState) => offerState.label === label);
    return item ? item.color : "";
};
