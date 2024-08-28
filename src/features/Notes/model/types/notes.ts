export interface VolunteerReviewTypeFields {
    id?: number;
    stars: number | undefined;
    applicationForm?: string;
    text: string;
}

export interface VolunteerReviewFields {
    volunteerReview: VolunteerReviewTypeFields
}

export interface HostReviewTypeFields {
    id?: number;
    stars: number | undefined;
    profile?: string;
    text: string;
}

export interface HostReviewFields {
    hostReview: HostReviewTypeFields
}
