export interface FormApplicationRequest {
    vacancy: string,
    startDate: string,
    endDate: string;
}

export interface FormApplicationResponse {
    id: number;
    vacancy: string;
    startDate: string;
    endDate: string;
    status: string;
}
