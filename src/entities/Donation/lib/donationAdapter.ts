import { AdminSort } from "@/entities/Admin";
import {
    DonationFilterFields, GetDonations, GetDonationsMapParams, GetDonationsParams,
} from "../model/types/donationSchema";
import { DonationCardType } from "../ui/DonationCard/DonationCard";
import { getMediaContent } from "@/shared/lib/getMediaContent";

export const donationFilterApiAdapter = (data: DonationFilterFields):
Partial<GetDonationsParams> => {
    const {
        category, showFinishedProjects, showSuccessProjects,
        sort,
    } = data;

    return {
        categoryId: category ? (category as number) : undefined,
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
        categoryId: category ? (category as number) : undefined,
        isCloseProject: showFinishedProjects,
        isSuccessProject: showSuccessProjects,
    };
};

export const donationCardAdapter = (data: GetDonations): DonationCardType => {
    const {
        id, name, shortDescription, image, isSuccess,
        organization, percentAmountCollect, daysLeft,
    } = data;

    return {
        id,
        title: name,
        description: shortDescription,
        image: getMediaContent(image?.contentUrl),
        organizationName: organization.name,
        isSuccess,
        daysLeft,
        percentAmountCollect,
    };
};
