import { Profile, ProfileApi } from "@/entities/Profile";

export interface Host {
    id: string;
    name: string;
    address: string;
    avatar?: string;
    type: string;
    website: string;
    description: string;
    vk: string;
    facebook: string;
    instagram: string;
    telegram: string;
    team: Profile[];
    vacancies: string[]; // link to offers /api/vacancies/id
    owner: Omit<Profile, "memberProfiles" | "membershipEndDate">;
}

export interface Video {
    id: string;
    url: string;
}

export type HostTeam = TeamUser[];

export interface HostMember {
    id: number;
    profile: ProfileApi;
}

export interface TeamUser {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: string;
    avatar: string;
    country: string;
    city: string;
}

export interface HostSchema {
    data?: Host;
}
