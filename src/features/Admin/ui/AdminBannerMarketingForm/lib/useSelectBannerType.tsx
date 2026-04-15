import { BannerMarketingType } from "@/entities/Admin";

export interface SelectType {
    label: string;
    value: BannerMarketingType;
}

export const useSelectBannerType = () => {
    const bannersType: SelectType[] = [
        { label: "Главная страница", value: BannerMarketingType.MAIN_PAGE },
        { label: "Под заголовком на всех страницах", value: BannerMarketingType.UNDER_HEADER_ALL_PAGES },
        { label: "Страница вакансий", value: BannerMarketingType.VACANCY_PAGE },
    ];

    return bannersType;
};
