import { OfferStatus } from "@/entities/Offer";

export const statusColors: Record<OfferStatus, string> = {
    "under consideration": "#79C8FF",
    accepted: "#77EB98",
    confirmed: "#5EECD2",
    rejected: "#FCC3C3",
};
