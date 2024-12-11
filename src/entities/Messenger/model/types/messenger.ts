import { Language } from "@/entities/Volunteer";

import { Skills } from "@/shared/data/skills";

export interface MessageType {
    id: number;
    author: string;
    text?: string;
    createdAt: string;
    viewed: boolean;
    applicationForm?: string;
}
export interface ChatsListWithVolunteers {
    id: number;
    volunteer: string;
    lastMessage: MessageType;
}

export interface ChatsListWithOrganizations {
    id: number;
    organization: string;
    lastMessage: MessageType;
}

export interface UserChatType {
    id: string;
    name: string;
    avatar: string;
    description: string;
    address: string;
    skills: Skills[];
    languages: Language[];
    cases: string[];
    arrivalDate: Date;
    expirationDate: Date;
    messages: MessageTypeMocked[];
}

export interface MessageTypeMocked {
    date: Date;
    content: string;
    isUser: boolean;
}
