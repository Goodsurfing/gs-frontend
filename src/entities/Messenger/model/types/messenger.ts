import { FormApplicationStatus } from "@/entities/Application";
import { HostApi } from "@/entities/Host";
import { Profile } from "@/entities/Profile";
import { Language, VolunteerApi } from "@/entities/Volunteer";

import { Skills } from "@/shared/data/skills";
import { MediaObjectType } from "@/types/media";

export interface MessageType {
    id: number;
    author: Profile;
    text?: string;
    attachments: string[] | MediaObjectType[];
    createdAt: string;
    // chat: string;
    applicationForm?: string;
    readByUserIds: string[];
}

export interface ChatsList {
    id: number;
    lastMessage?: MessageType;
    applicationStatus?: FormApplicationStatus;
    otherParticipants: Profile[];
    countUnreadMessages: number;
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
    applicationStatus?: FormApplicationStatus;
    otherParticipants: Profile[];
    countUnreadMessages: number;
}
