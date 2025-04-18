import cn from "classnames";
import { memo } from "react";

import { useTranslation } from "react-i18next";
import { InfoCard, InfoCardItem } from "@/shared/ui/InfoCard/InfoCard";

import { OfferWhen } from "../../model/types/offerWhen";
import styles from "./OfferWhenCard.module.scss";
import { formatDate } from "@/shared/lib/formatDate";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OfferWhenProps {
    className?: string;
    offerWhen: OfferWhen;
}

export const OfferWhenCard = memo((props: OfferWhenProps) => {
    const {
        className,
        offerWhen: {
            periods, durationMinDays,
            durationMaxDays, applicationEndDate,
        },
    } = props;
    const { locale } = useLocale();
    const { t } = useTranslation("offer");
    const emptyMessage = "Точная дата не указана";
    const offerPeriodEnd = applicationEndDate
        ? formatDate(locale, applicationEndDate) : emptyMessage;
    const isHavePeriods = periods.length > 0;
    const isRenderGridPeriods = periods.length > 3;

    const renderItemPeriods = periods.map((period) => {
        const { start, ending } = period;

        return (
            <p>{`${formatDate(locale, start ?? "")} — ${formatDate(locale, ending ?? "")}`}</p>
        );
    });

    const renderPeriods = isHavePeriods ? renderItemPeriods : emptyMessage;

    return (
        <div className={cn(className)}>
            <InfoCard>
                <InfoCardItem
                    className={styles.left}
                    title={t("personalOffer.Когда")}
                >
                    {isRenderGridPeriods ? (
                        <div className={styles.grid}>
                            {renderPeriods}
                        </div>
                    ) : renderPeriods}
                </InfoCardItem>
                <div className={styles.right}>
                    <InfoCardItem
                        title={t("personalOffer.Минимум дней")}
                        text={durationMinDays}
                    />
                    <InfoCardItem
                        title={t("personalOffer.Максимум дней")}
                        text={durationMaxDays}
                    />
                    <InfoCardItem
                        title={t("personalOffer.Прием заявок до")}
                        text={offerPeriodEnd}
                    />
                </div>
            </InfoCard>
        </div>
    );
});
