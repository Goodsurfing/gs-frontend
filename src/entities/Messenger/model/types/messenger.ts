import { FormApplicationStatus } from "@/entities/Application";
import { Host, HostApi } from "@/entities/Host";
import { Language, VolunteerApi } from "@/entities/Volunteer";

import { Skills } from "@/shared/data/skills";

export interface MessageType {
    id: number;
    author: string;
    text?: string;
    createdAt: string;
    viewedVolunteer: boolean;
    viewedOrganization: boolean;
    applicationForm?: string;
}
export interface ChatsListWithVolunteers {
    id: number;
    volunteer: VolunteerApi;
    lastMessage: MessageType;
    vacancyStatus?: FormApplicationStatus;
    countUnreadMessagesByOrganization: number;
}

export interface ChatsListWithOrganizations {
    id: number;
    organization: HostApi;
    lastMessage: MessageType;
    vacancyStatus?: FormApplicationStatus;
    countUnreadMessagesByVolunteer: number;
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
    organization: Host;
    vacancyStatus?: FormApplicationStatus;
    volunteer: VolunteerApi;
}
