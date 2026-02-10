import { Pagination } from "@/types/api/pagination";
import { AdminSort } from "./adminSchema";
import { Image } from "@/types/media";

export interface AdminCourseAuthorFileds {
    id: string;
    firstName: string | null;
    lastName: string | null;
}

export interface AdminCourseFields {
    name: string;
    image: Image | null;
    aboutCourse: string;
    aboutAuthor: string;
    forWhom: string;
    experts: AdminExpertFields[];
    isPublic: boolean;
    author: AdminCourseAuthorFileds | null;
}

export interface AdminExpertFields {
    name: string;
    description: string;
    image: Image | null;
}

export interface AdminLessonsFields {
    name: string;
    description: string;
    duration: number;
    image: Image | null;
    videoUrl: string;
}

export interface GetAdminCourses {
    id: string;
    name: string;
    isActive: boolean;
    takeCourseCount: number;
    completeCourseCount: number;
    author: {
        id: string;
        firstName: string;
        lastName: string;
    }
    reviewsCount: number;
    averageRating: number;
}

export interface GetAdminCoursesResponse {
    data: GetAdminCourses[];
    pagination: Pagination;
}

export interface GetAdminCoursesParams {
    sort: AdminSort;
    authorFirstName: string;
    authorLastName: string;
    name: string;
    page: number;
    limit: number;
}

export interface GetAdminCourse {
    id: number;
    name: string;
    description: string;
    aboutAuthor: string;
    courseFor: string;
    isActive: boolean;
    author: {
        id: string;
        firstName: string;
        lastName: string;
        image: Image | null;
    }
    experts: GetAdminCourseExpert[];
    // duration: number;
    // lessons: GetAdminLesson[];
    // totalStart: number;
    // totalEnd: number;
    // totalReviews: number;
    // averageReviews: number;
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

export interface GetAdminCourseExpert {
    id: string;
    firstName: string;
    lastName: string;
    project: string;
    country: string;
    city: string;
    image: Image;
}

export interface CreateAdminCourseRequest {
    name: string;
    description: string;
    aboutAuthor: string;
    courseFor: string;
    isActive: boolean;
    imageId: string | null;
    authorId: string;
    expertsIds: string[];

    // duration: number;
    // lessons: CreateAdminLesson[];
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

export interface GetAdminReviewsLesson {
    id: string;
    rating: number;
    description: string;
    author: {
        id: string;
        email: string;
        lastName: string;
        firstName: string;
    }
    created: string;
}

export type GetAdminReviewLesson = GetAdminReviewsLesson;

export interface GetAdminReviewsLessonResponse {
    data: GetAdminReviewsLesson[];
    pagination: Pagination;
}

export interface GetReviewsLessonRequest {
    lessonId: string;
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
    rating: number;
    description: string;
}

export interface UpdateAdminReviewCourseRequest {
    id: number;
    body: UpdateAdminReviewCourse;
}

// Lesson

export interface GetAdminCourseLessons {
    id: string;
    name: string;
    description: string;
    duration: string;
    averageRating: number;
}
export interface GetAdminCourseLessonsRequest {
    courseId: string;
    page: number;
    limit: number;
}

export interface GetAdminCourseLessonsResponse {
    data: GetAdminCourseLessons[];
    pagination: Pagination;
}

export interface GetAdminCourseLesson {
    id: string;
    name: string;
    description: string;
    url: string;
    sort: number;
    duration: number;
    image: Image;
}

export interface CreateAdminCourseLesson {
    name: string;
    url: string;
    description: string;
    courseId: string;
    imageId: string;
    duration: number;
    sort: number;
}

// Experts

export interface GetAdminExperts {
    id: string;
    firstName: string;
    lastName: string;
    project: string;
    country: string;
    city: string;
}

export interface GetAdminExpertsResponse {
    data: GetAdminExperts[];
    pagination: Pagination;
}

export interface GetAdminExpertsRequest {
    sort: AdminSort;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface GetAdminExpert {
    id: string;
    firstName: string;
    lastName: string;
    project: string;
    country: string;
    city: string;
    isRegisterUser: boolean;
    image: Image;
}

export interface CreateAdminExpertUserRequest {
    userId: string;
    project: string;
}

export interface UpdateAdminExpertUser {
    userId: string;
    project: string;
}

export interface UpdateAdminExpertUserRequest {
    expertId: string;
    body: UpdateAdminExpertUser;
}

export interface CreateAdminExpert {
    firstName: string;
    lastName: string;
    project: string;
    imageId: string | null;
    country: string;
    city: string;
}

export interface UpdateAdminExpertRequest {
    expertId: string;
    body: CreateAdminExpert;
}
