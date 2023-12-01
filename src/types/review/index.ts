export interface ReviewCardInfo {
    id: number;
    title: string;
    image: string;
    country: string;
    city: string;
    textReview: string;
    author: string;
    date: Date;
    rating: number;
}

export interface Review {
    id: number;
    title: string;
    image: string;
    rating: number;
    textReview: string;
    city: string;
    country: string;
}
