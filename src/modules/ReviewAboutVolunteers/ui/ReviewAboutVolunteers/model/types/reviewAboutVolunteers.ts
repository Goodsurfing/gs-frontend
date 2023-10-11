export interface userCardInfo {
    id: number;
    avatar: string;
    name: string;
    surname: string;
    country: string;
    city: string;
}

export interface userCardFullInfo extends userCardInfo {
    textReview: string;
}
