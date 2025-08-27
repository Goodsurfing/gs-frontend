import { API_BASE_URL } from "@/shared/constants/api";
import { ChatFormFields } from "../model/types/chatForm";
import { formattingDate } from "@/shared/lib/formatDate";

export const applicationOfferAdapter = (
    data: ChatFormFields,
    offerId: string,
): FormData => {
    const { applicationForm: { startDate, endDate } } = data;

    const formData = new FormData();
    formData.append("vacancy", `${API_BASE_URL}vacancies/${offerId}`);
    formData.append("startDate", formattingDate(startDate) ?? "");
    formData.append("endDate", formattingDate(endDate) ?? "");

    return formData;
};
