import { Host } from "@/entities/Host";

type Gender = "male" | "female";

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
    organizations?: Host[];
}

export interface ProfileSchema {
    data?: Profile;
    form?: Profile;
    readonly: boolean;
}
