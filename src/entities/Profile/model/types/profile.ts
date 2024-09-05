import { Host } from "@/entities/Host";
import { VolunteerApi } from "@/entities/Volunteer";

export type Gender = "male" | "female" | "other";

export interface MemberProfiles {
    id: number;
    organization: string;
}
export interface Profile {
    id: string;
    email: string;
    locale: string;
    firstName?: string;
    lastName?: string;
    gender?: Gender;
    birthDate?: string;
    country?: string;
    city?: string;
    phone?: string;
    image?: ImageType | string;
    aboutMe?: string;
    vk?: string;
    facebook?: string;
    instagram?: string;
    telegram?: string;
    organizations?: Host[] | [];
    host?: string;
    volunteer?: Omit<VolunteerApi, "profile">;
    memberProfiles: MemberProfiles;
    membershipEndDate: string;
}

export interface ImageType {
    id: string;
    contentUrl: string;
}

export interface ProfileSchema {
    data?: Profile;
    form?: Profile;
    readonly: boolean;
}
