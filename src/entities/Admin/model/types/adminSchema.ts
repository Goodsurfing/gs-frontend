import { Achievement } from "@/types/achievements";
import { Pagination } from "@/types/api/pagination";
import { Skill } from "@/types/skills";

export interface Admin {
    token: string,
}

export interface AdminSchema {
    authData?: Admin,
}

export interface AdminUsersFields {
    id: string;
    email?: string;
    name?: string;
    dateRegistration?: string;
    dateLogin?: string;
    isConfirmed: boolean;
    isVolunteer: boolean;
    isHost: boolean;
    isBlock: boolean;
    isMembership: boolean;
    dateEndMembership: string;
}

export interface AdminOrganizationsFields {
    id: string;
    name?: string;
    owner: string;
    countMembers: number;
    countVacancies: number;
    countVolunteers: number;
    isBlock: boolean;
}

export interface CreateAdminSkillRequest {
    name: string;
    image: File;
}

export interface EditAdminSkillRequest {
    skillId: number;
    body: Omit<CreateAdminSkillRequest, "image"> & {
        image: File | string;
    };
}

export interface GetAdminSkillsParams {
    sort: "id:asc" | "id:desc" | "name:asc" | "name:desc";
    id: number; // search by id skill
    name: string; // search by name of skill
    page: number;
    limit: number;
}

export interface GetAdminSkillsResponse {
    data: Skill[];
    pagination: Pagination
}

export interface CreateAdminAchievementsRequest {
    name: string;
    image: File;
}

export interface EditAdminAchievementsRequest {
    achievementId: number;
    body: Omit<CreateAdminAchievementsRequest, "image"> & {
        image: File | string;
    };
}

export interface GetAdminAchievementsParams {
    sort: "id:asc" | "id:desc" | "name:asc" | "name:desc";
    id: number; // search by id achievement
    name: string; // search by name of achievement
    page: number;
    limit: number;
}

export interface GetAdminAchievementsResponse {
    data: Achievement[];
    pagination: Pagination
}

export interface SearchUsersParams {
    limit: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

export interface SearchUsersResponse {
    id: string;
    firstName: string;
    lastName: string;
}

export interface EditReviewVacancy {
    reviewId: number;
    body: {
        score: number;
        description: string;
    }
}

export interface GetAdminReviewVacancyListParams {
    sort?: "id:asc" | "id:desc" | "fio.author:asc" | "fio.author:desc" | "vacancy.name:asc" |
    "vacancy.name:desc" | "score:asc" | "score:desc" | "created:asc" | "created:desc";
    authorLastName: string;
    authorFirstName: string;
    vacancyName: string;
    page: number;
    limit: number;
}

export interface AdminReviewVacancy {
    id: number;
    authorFirstName: string;
    authorLastName: string;
    vacancyName: string;
    score: number;
    description: string;
    created: string;
}

export interface GetAdminReviewVacancyListResponse {
    data: AdminReviewVacancy[];
    pagination: Pagination
}
