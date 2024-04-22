import { useTranslation } from "react-i18next";

export function useFormatMonthDay() {
    const { t } = useTranslation("offer");

    return (value: number) => {
        const mounthsCount = Math.floor(value / 31);
        const daysCount = value % 31;

        let days = "";
        let mounths = "";

        if (daysCount !== 0) {
            if (daysCount === 1) {
                days = t("when.день");
            } else if (daysCount <= 4 && daysCount >= 2) {
                days = t("when.дня");
            } else if (daysCount >= 5 && daysCount <= 20) {
                days = t("when.дней");
            } else if (daysCount === 21) {
                days = t("when.день");
            } else if (daysCount > 21 && daysCount < 25) {
                days = t("when.дня");
            } else days = t("when.дней");
        }

        if (mounthsCount === 1) {
            mounths = t("when.месяц");
        } else if (mounthsCount >= 2 && mounthsCount <= 4) {
            mounths = t("when.месяца");
        } else mounths = t("when.месяцев");

        if (daysCount < 31 && !mounthsCount) {
            return `${daysCount} ${days}`;
        }

        return `${mounthsCount} ${mounths}${daysCount ? "," : ""} ${
            daysCount === 0 ? "" : daysCount
        } ${days}`;
    };
}
