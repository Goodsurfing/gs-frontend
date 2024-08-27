export interface VolunteerReviewTypeFields {
    id?: number;
    stars: number | undefined;
    applicationForm?: string;
    text: string;
}

export interface VolunteerReviewFields {
    volunteerReview: VolunteerReviewTypeFields
}
