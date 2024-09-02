import { useTranslation } from "react-i18next";
import { TimeType } from "@/entities/Offer";

export const useTranslateTimeType = (): ((timeType: TimeType) => string) => {
    const { t } = useTranslation("offer");

    return (timeType: TimeType): string => {
        switch (timeType) {
            case "week":
                return t("whatToDo.week", "неделя");
            case "day":
                return t("whatToDo.day", "день");
            case "month":
                return t("whatToDo.month", "месяц");
            default:
                return timeType;
        }
    };
};
