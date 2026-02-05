import { Pagination } from "@/types/api/pagination";
import { AdminSort } from "./adminSchema";
import { Image } from "@/types/media";

export interface GetAdminCourses {
    id: number;
    name: string;
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

export interface GetAdminCourse {
    id: number;
    name: string;
    duration: number;
    image: Image | null;
    aboutCourse: string;
    aboutAuthor: string;
    forWhom: string;
    experts: GetAdminExpert[];
    lessons: GetAdminLesson[];
    authorId: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    isPublic: boolean;
    totalStart: number;
    totalEnd: number;
    totalReviews: number;
    averageReviews: number;
}

export interface CreateAdminLesson {
    name: string;
    description: string;
    duration: number;
    imageId: string | null;
    videoUrl: string;
}

export type GetAdminLesson = CreateAdminLesson & {
    id: number;
};

export interface CreateAdminExpert {
    imageId: string;
    name: string;
    description: string;
}

export type GetAdminExpert = Omit<CreateAdminExpert, "imageId"> & {
    id: number;
    image: Image;
};

export interface CreateAdminCourseRequest {
    name: string;
    duration: number;
    imageId: string | null;
    aboutCourse: string;
    aboutAuthor: string;
    forWhom: string;
    experts: CreateAdminExpert[];
    lessons: CreateAdminLesson[];
}

export interface UpdateAdminCourseRequest extends CreateAdminCourseRequest {
    id: number;
    body: CreateAdminCourseRequest;
}
