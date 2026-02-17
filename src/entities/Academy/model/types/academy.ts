import { AdminSort } from "@/entities/Admin";
import { Review } from "@/entities/Review";
import { Pagination } from "@/types/api/pagination";
import { Image } from "@/types/media";

export interface Exptert {
    image: string;
    name: string;
    description: string;
    address: string;
}

export interface Lesson {
    id: number;
    thumbnail: string;
    title: string;
    description: string;
    duration: string;
    rating: number;
    reviews: Review[]
}

export interface Course {
    id: number;
    cover?: string;
    title: string;
    description?: string;
    author: string;
    aboutAuthor?: string;
    forWho?: string;
    experts: Exptert[];
    lessons: Lesson[];
    numberLessons: number;
    progress: number;
    duration: string;
    rating: number;
    reviews: Review[];
}

export interface Courses {
    id: string;
    name: string;
    description: string;
    duration: string;
    averageRating: number;
    videoCount: number;
    image: Image;
    author: {
        firsName: string;
        lastName: string;
    }
}
export interface GetCoursesResponse {
    data: Courses[];
    pagination: Pagination;
}

export interface GetCoursesParams {
    sort: AdminSort;
    page: number;
    limit: number;
}

export interface GetExpert {
    id: string;
    firstName: string;
    lastName: string;
    project: string;
    country: string;
    city: string;
    image: Image;
}

export interface GetCourse {
    name: string;
    description: string;
    aboutAuthor: string;
    courseFor: string;
    duration: string;
    averageRating: number;
    videoCount: number;
    courseProgressNumber: number[];
    image: Image;
    author: {
        firsName: string;
        lastName: string;
    };
    experts: GetExpert[];
}

export interface GetCourseRequest {
    courseId: string;
    body: GetCourse;
}

// Review on lesson
export interface GetReviewsLesson {
    rating: number;
    description: string;
    author: {
        id: string;
        lastName: string;
        firstName: string;
        image: Image;
    };
    created: string;
}

export interface GetReviewsLessonResponse {
    data: GetReviewsLesson[];
    pagination: Pagination;
}

export interface GetReviewsLessonRequest {
    videoCourseId: string;
    page: number;
    limit: number;
}

export interface CreateReviewLessonRequest {
    rating: number;
    description: string;
    videoCourseId: string;
}

// Lesson

export interface GetLessons {
    id: string;
    name: string;
    description: string;
    duration: string;
    averageRating: number;
    image: Image;
}

export interface GetLessonsResponse {
    data: GetLessons[];
    pagination: Pagination
}

export interface GetLessonsRequest {
    courseId: string;
    page: number;
    limit: number;
}

export interface GetLesson {
    id: string;
    name: string;
    description: string;
    url: string;
    duration: string;
    averageRating: number;
    image: Image;
    isCanReview: boolean;
    course: {
        id: string;
        name: string;
    }
}
