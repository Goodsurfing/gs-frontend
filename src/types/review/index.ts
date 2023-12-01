export interface ReviewCardInfo {
    id: number;
    title: string;
    image: string;
    country: string;
    city: string;
    textReview: string;
}

export interface Review {
    id: number;
    author: string;
    authorAvatar: string;
    rating: number;
    title: string;
    textReview: string;
    date: Date;
}
