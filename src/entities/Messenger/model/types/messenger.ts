import { FormApplicationStatus } from "@/entities/Application";
import { HostApi } from "@/entities/Host";
import { Language, VolunteerApi } from "@/entities/Volunteer";

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
    vacancyStatus?: FormApplicationStatus;
}

export interface ChatsListWithOrganizations {
    id: number;
    organization: HostApi;
    lastMessage: MessageType;
    vacancyStatus?: FormApplicationStatus;
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

export interface ChatType {
    id: number;
    lastMessage: MessageType;
    organization: string;
    vacancyStatus?: FormApplicationStatus;
    volunteer: VolunteerApi;
}
