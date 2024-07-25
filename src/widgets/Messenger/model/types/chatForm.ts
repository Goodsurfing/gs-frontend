export interface ApplicationFormType {
    startDate: Date | undefined,
    endDate: Date | undefined;
}

export interface ChatFormFields {
    applicationForm: ApplicationFormType;
}
