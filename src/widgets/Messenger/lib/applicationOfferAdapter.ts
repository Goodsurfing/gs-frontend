import { ChatFormFields } from "../model/types/chatForm";

export const applicationOfferAdapter = (
    data: ChatFormFields,
    offerId: string,
): FormData => {
    const { applicationForm: { startDate, endDate } } = data;

    const formData = new FormData();
    formData.append("vacancy", offerId);
    formData.append("startDate", startDate?.toLocaleDateString() || "");
    formData.append("endDate", endDate?.toLocaleDateString() || "");

    return formData;
};
