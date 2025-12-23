import { FormApplicationStatus } from "@/entities/Application";
import { Pagination } from "@/types/api/pagination";
import { Image } from "@/types/media";

export interface Review {
    reviewText: string;
    rating: number;
    avatar: string;
    name: string;
    date: string;
}

export interface ApplicationReview {
    id: number;
    stars: number;
    applicationForm: string;
    text: string;
}

export type ApplicationReviewResponse = ApplicationReview & {
    volunteerId: string;
    volunteerAuthorId?: string;
    organizationId?: string;
    organizationAuthorId?: string;
    vacancyId?: number;
};

export interface GetAboutVolunteerReview {
    id: string;
    author: {
        id: string;
        firstName: string;
        lastName: string;
        city: string;
        country: string;
        imagePath: string;
    };
    rating: number;
    description: string;
    created: string;
}

export interface CreateVolunteerReview {
    volunteerId: string;
    rating: number;
    description: string;
}

export interface GetAboutVolunteerReviewRequest {
    data: GetAboutVolunteerReview[];
    pagination: Pagination;
}

export interface GetAboutVolunteerReviewParams {
    page: number;
    limit: number;
}

export interface CreateOfferReview {
    vacancyId: number;
    rating: number;
    description: string;
}

export interface GetOfferReview {
    id: string;
    description: string;
    created: string;
    rating: number;
    vacancy: {
        id: number;
        name: string;
        image: Image;
    },
    author: {
        id: string;
        firstName: string;
        lastName: string;
        image: Image;
    }
}

export interface GetOfferReviewRequest {
    data: GetOfferReview[];
    pagination: Pagination;
}

export interface GetOfferReviewParams {
    page: number;
    limit: number;
}

export interface GetOfferReviewByVacancyIdParams {
    vacancyId: number;
    page: number;
    limit: number;
}

export interface GetOfferReviewByVacancy {
    id: string;
    author: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        image: Image | null;
    }
    description: string;
    rating: number;
}

export interface GetOfferReviewByVacancyResponse {
    data: GetOfferReviewByVacancy[];
    pagination: Pagination;
}

export interface MyReviewVolunteer {
    id: string;
    vacancy: {
        id: number;
        name: string | null;
        image: Image | null;
    };
    rating: number;
    description: string;
    created: string;
}

export interface MyReviewVolunteerRequest {
    data: MyReviewVolunteer[];
    pagination: Pagination;
}

export interface NotDoneReviewVolunteer {
    id: number;
    name: string | null;
    image: Image | null;
    address: string | null;
    applicationStatus: FormApplicationStatus;
    categories: {
        id: number;
        name: string;
    }[];
}

export interface MyReviewHost {
    id: string;
    volunteer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        image: Image | null;
        city: string;
        country: string;
    }
    rating: number;
    description: string;
}

export interface MyReviewHostResponse {
    data: MyReviewHost[];
    pagination: Pagination;
}

export interface NotDoneReviewHost {
    id: string;
    firstName: string | null;
    lastName: string | null;
    image: Image | null;
    city: string | null;
    country: string | null;
    statusApplication: FormApplicationStatus;
}
