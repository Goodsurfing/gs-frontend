import { Pagination } from "@/types/api/pagination";
import { Image } from "@/types/media";
import { AdminSort } from "./adminSchema";

export interface OurTeamFields {
    firstName: string;
    lastName: string;
    position: string;
    vkontakte: string;
    telegram: string;
    image: Image;
    isFounder: boolean;
    sort: number;
    userId: string;
}

export interface GetOurTeamParams {
    isFounder: boolean;
    page: number;
    limit: number;
}

export interface GetOurTeams {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    vkontakte: string;
    telegram: string;
    image: Image;
}

export interface GetOurTeamResponse {
    data: GetOurTeams[];
    pagination: Pagination;
}

export interface GetAdminOurTeamParams {
    sort?: AdminSort;
    page: number;
    limit: number;
}

export type GetAdminOurTeams = Omit<GetOurTeams, "vkontakte" | "telegram" | "image"> & {
    sort: number;
    isFounder: boolean;
};

export interface GetAdminOurTeamResponse {
    data: GetAdminOurTeams[];
    pagination: Pagination;
}

export type GetAdminOurTeam = GetAdminOurTeams & {
    vkontakte: string;
    telegram: string;
    userId: string;
    image: Image;
};

export type CreateAdminOurTeam = Omit<GetAdminOurTeam, "id" | "image"> & {
    imageId: string;
};

export interface UpdateAdminOurTeamRequest {
    id: string;
    body: CreateAdminOurTeam;
}
