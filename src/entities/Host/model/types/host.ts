import { Gallery } from "@/modules/Gallery/model/types/gallery";

import { Article } from "@/entities/Article";
import { Offer, OfferState } from "@/entities/Offer";
import { Profile } from "@/entities/Profile";
import { Review } from "@/entities/Review";
import { VolunteerApi } from "@/entities/Volunteer";

export interface Host {
    id: string;
    name: string;
    address: string;
    type: string;
    website: string;
    description: string;
    vk: string;
    facebook: string;
    instagram: string;
    telegram: string;
    team: Profile[];
    vacancies: string[]; // link to offers /api/vacancies/id
    owner: Profile;
}

export interface Video {
    id: string;
    url: string;
}

export type VideoGallery = Video[];

export type HostTeam = TeamUser[];

export interface Application {
    id: number;
    volunteer: VolunteerApi;
    vacancy: Offer;
    startDate: string;
    endDate: string;
    status: OfferState;
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

export interface FullHost {
    host: Host;
    offers?: Offer[];
    gallery?: Gallery;
    videoGallery?: VideoGallery;
    team: HostTeam;
    reviews?: Review[];
    articles?: Article[];
}

export interface HostSchema {
    data?: Host;
}
