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
