import { Pagination } from "@/types/api/pagination";
import { Category } from "@/types/categories";
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
        imagePath: string;
    },
    author: {
        id: string;
        firstName: string;
        lastName: string;
        imagePath: string;
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

export interface MyReviewVolunteer {
    id: number;
    vacancy: {
        id: number;
        title: string;
        image: Image;
        created: string;
    };
    author: {
        id: string;
        image: Image;
        firstName: string;
        lastName: string;
    };
    rating: number;
    description: string;
}

export interface NotDoneReviewVolunteer {
    id: number;
    vacancy: {
        id: number;
        title: string;
        image: Image;
        created: string;
        city: string;
        country: string;
        categories: Category[];
    };
}

export interface MyReviewHost {
    id: number;
    volunteer: {
        id: string;
        firstName: string;
        lastName: string;
        image: Image;
        city: string;
        country: string;
    }
    rating: number;
    description: string;
}

export interface NotDoneReviewHost {
    id: number;
    volunteer: {
        id: string;
        firstName: string;
        lastName: string;
        image: Image;
        city: string;
        country: string;
    }
}
