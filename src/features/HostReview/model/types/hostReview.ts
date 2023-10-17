export interface UserCardInfo {
    id: number;
    avatar: string;
    name: string;
    surname: string;
    country: string;
    city: string;
}

export interface UserCardFullInfo extends UserCardInfo {
    textReview: string;
}

export interface ReviewOffer {
    id: number;
    author: string;
    authorAvatar: string;
    rating: number;
    title: string;
    textReview: string;
    date: Date;
}
