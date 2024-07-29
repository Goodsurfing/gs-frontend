import { OfferState } from "@/entities/Offer";

export const statusColors: Record<OfferState, string> = {
    new: "#79C8FF",
    accepted: "#77EB98",
    confirmed: "#5EECD2",
    rejected: "#FCC3C3",
};
