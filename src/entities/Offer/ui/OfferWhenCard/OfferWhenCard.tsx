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
    const { className, offerWhen: { periods, durationMinDays, durationMaxDays } } = props;
    const period = periods?.[0];
    const offerPeriodStart = (period && period.start) ? period.start : "Точная дата не указана";
    const offerPeriodEnd = (period && period.ending) ? period.ending : "Точная дата не указана";
    const { locale } = useLocale();
    const { t } = useTranslation("offer");

    return (
        <div className={cn(className)}>
            <InfoCard>
                <InfoCardItem
                    className={styles.left}
                    title={t("personalOffer.Когда")}
                    text={formatDate(locale, offerPeriodStart)}
                />
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
                        text={formatDate(locale, offerPeriodEnd)}
                    />
                </div>
            </InfoCard>
        </div>
    );
});
