import { Pagination } from "@/types/api/pagination";
import { AdminSort } from "./adminSchema";
import { Image } from "@/types/media";

export interface AdminCourseFields {
    name: string;
    duration: number;
    image: File | string | null;
    aboutCourse: string;
    aboutAuthor: string;
    forWhom: string;
    experts: AdminExpertFields[];
    lessons: AdminLessonsFields[];
    isPublic: boolean;
}

export interface AdminExpertFields {
    name: string;
    description: string;
    image: File | string | null;
}

export interface AdminLessonsFields {
    name: string;
    description: string;
    duration: number;
    image: File | string | null;
    videoUrl: string;
}

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
    image: File | null;
    videoUrl: string;
}

export type GetAdminLesson = CreateAdminLesson & {
    id: number;
};

export interface CreateAdminExpert {
    image: File | null;
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
    image: File | null;
    aboutCourse: string;
    aboutAuthor: string;
    forWhom: string;
    experts: CreateAdminExpert[];
    lessons: CreateAdminLesson[];
    isPublic: boolean;
}

export interface UpdateAdminCourseRequest {
    id: number;
    body: CreateAdminCourseRequest;
}

export interface GetAdminReviewsCourses {
    id: number;
    authorId: string;
    authorFirstName: string;
    authorLastName: string;
    name: string;
    rating: number;
    description: string;
    date: string;
}

export interface GetAdminReviewsCoursesResponse {
    data: GetAdminReviewsCourses[]
    pagination: Pagination;
}

export interface GetAdminReviewsCoursesParams {
    sort: AdminSort;
    name: string;
    author: string;
    page: number;
    limit: number;
}

export interface GetAdminReviewCourse {
    id: number;
    authorId: string;
    authorFirstName: string;
    authorLastName: string;
    name: string;
    rating: number;
    description: string;
    date: string;
}

export interface UpdateAdminReviewCourse {
    name: string;
    description: string;
    rating: number;
}

export interface UpdateAdminReviewCourseRequest {
    id: number;
    body: UpdateAdminReviewCourse;
}
