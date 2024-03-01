import { Host } from "@/entities/Host";
import { Volunteer } from "@/entities/Volunteer";

export type Gender = "male" | "female" | "other";

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
    imageUuid?: string;
    aboutMe?: string;
    vk?: string;
    facebook?: string;
    instagram?: string;
    telegram?: string;
    organizations?: Host[] | [];
    volunteer?: Volunteer;
}

export interface ProfileSchema {
    data?: Profile;
    form?: Profile;
    readonly: boolean;
}
