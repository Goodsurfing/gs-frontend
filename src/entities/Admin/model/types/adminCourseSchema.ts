import { Pagination } from "@/types/api/pagination";
import { AdminSort } from "./adminSchema";

export interface GetAdminCourses {
    id: number;
    authorId: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    isPublic: boolean;
    totalStart: number;
    totalEnd: number;
    totalReviews: number;
    averageReviews: number;
}

export interface GetAdminCoursesResponse {
    data: GetAdminCourses[];
    pagination: Pagination;
}

export interface GetAdminCoursesParams {
    sort: AdminSort;
    authorFirstName: string;
    authorLastName: string;
    courseName: string;
    page: number;
    limit: number;
}
