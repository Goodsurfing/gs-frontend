import { AdminSort } from "@/entities/Admin";
import { DonationFilterFields, GetDonationsMapParams, GetDonationsParams } from "../model/types/donationSchema";

export const donationFilterApiAdapter = (data: DonationFilterFields):
Partial<GetDonationsParams> => {
    const {
        category, showFinishedProjects, showSuccessProjects,
        sort,
    } = data;

    return {
        categoryId: category,
        isCloseProject: showFinishedProjects,
        isSuccessProject: showSuccessProjects,
        sort: sort === "urgency" ? AdminSort.EndDateDesc : undefined,
        isAuth: false,
    };
};

export const donationMapFilterApiAdapter = (data: DonationFilterFields):
Partial<GetDonationsMapParams> => {
    const {
        category, showFinishedProjects, showSuccessProjects,
    } = data;

    return {
        categoryId: category,
        isCloseProject: showFinishedProjects,
        isSuccessProject: showSuccessProjects,
    };
};
