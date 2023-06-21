export interface IRequestUser {
    name: string;
    location: string;
    image?: string;
}

export enum RequestNotification {
    NEW = "новая",
    COMPLETED = "принята",
    REJECTED = "отклонена",
}

export interface IHostDashboardRequestCard {
    user: IRequestUser;
    notification: RequestNotification;
    article: string;
}
