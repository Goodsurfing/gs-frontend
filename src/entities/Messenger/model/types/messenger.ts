import { FormApplicationStatus } from "@/entities/Application";
import { Language } from "@/entities/Volunteer";
import { Skills } from "@/shared/data/skills";

export interface UserType {
    id: string;
    avatar: string;
    name: string;
    date: string;
    lastMessage: string;
    newMessages: number;
    state: FormApplicationStatus;
}

export interface UserChatType {
    id: string;
    name: string;
    avatar: string;
    description: string;
    address: string;
    skills: Skills[];
    languages: Language[];
    cases: string[]
    arrivalDate: Date;
    expirationDate: Date;
    messages: MessageType[];
}

export interface MessageType {
    date: Date;
    content: string;
    isUser: boolean;
}
