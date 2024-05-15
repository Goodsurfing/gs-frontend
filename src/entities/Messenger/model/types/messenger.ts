import { OfferState } from "@/entities/Offer";

export interface UserType {
    id: string;
    avatar: string;
    name: string;
    date: string;
    lastMessage: string;
    newMessages: number;
    state: OfferState
}
