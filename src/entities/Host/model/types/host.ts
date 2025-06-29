import { ImageType, Profile, ProfileApi } from "@/entities/Profile";
import { MediaObjectType } from "@/types/media";

export interface Host {
    id: string;
    name: string;
    address: string;
    avatar?: ImageType;
    type: string;
    otherType: string;
    website: string;
    description: string;
    shortDescription: string;
    vk: string;
    facebook: string;
    instagram: string;
    telegram: string;
    team: Profile[];
    vacancies: string[]; // link to offers /api/vacancies/id
    owner: Omit<Profile, "memberProfiles" | "membershipEndDate">;
    videoGallery: string[]
    galleryImages: MediaObjectType[];
    averageRating?: number;
    feedbacksCount: number;
}

export type HostApi = Omit<Host, "avatar" | "galleryImages"> & {
    avatar?: string;
    galleryImages: string[];
};

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
