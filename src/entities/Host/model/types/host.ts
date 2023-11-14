import { Gallery } from "@/modules/Gallery/model/types/gallery";

import { Offer } from "@/entities/Offer";

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
}

export interface Video {
    id: string;
    url: string;
}

export type VideoGallery = Video[];

export type HostTeam = TeamUser[];

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
    review?: HostReview[];
    articles?: Article[];
}

export interface HostReview {
    textReview: string;
    rating: number;
    author: string;
    date: string;
}

export interface Article {
    id: string;
    image: string;
    title: string;
    tag: string;
    date: string;
    description: string;
    likes: number;
    comments: number;
}

export interface HostSchema {
    data?: Host;
}
