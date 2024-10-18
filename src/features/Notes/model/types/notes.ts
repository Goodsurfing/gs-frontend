export interface ReviewTypeFields {
    id?: number;
    stars: number | undefined;
    applicationForm?: string;
    text: string;
}

export interface ReviewFields {
    review: ReviewTypeFields;
}
