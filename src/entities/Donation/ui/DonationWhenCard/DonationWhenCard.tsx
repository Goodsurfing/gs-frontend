import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { InfoCard, InfoCardItem } from "@/shared/ui/InfoCard/InfoCard";

import { DonationProgressBar } from "../DonationProgressBar/DonationProgressBar";
import styles from "./DonationWhenCard.module.scss";

interface DonationWhenCardProps {
    className?: string;
    dateStart: string | null;
    daysLeft: number | null;
    percentAmountCollect: number | null;
    amount: number | null;
    isSuccess: boolean;
}

export const DonationWhenCard = memo((props: DonationWhenCardProps) => {
    const {
        className,
        dateStart,
        daysLeft,
        amount,
        percentAmountCollect,
        isSuccess,
    } = props;
    const { t } = useTranslation("donation");
    const emptyMessage = t("donationPersonal.Точная дата не указана");
    const donationDateStart = () => {
        if (!dateStart) {
            return t("donationPersonal.Не имеет даты старта");
        }
        return dateStart || emptyMessage;
    };

    return (
        <div className={cn(className)} id="description">
            <InfoCard className={styles.wrapper}>
                <InfoCardItem
                    title={t("donationPersonal.Дата старта")}
                    className={styles.infoCard}
                >
                    {donationDateStart()}
                </InfoCardItem>
                {(daysLeft && !isSuccess) && (
                    <InfoCardItem
                        title={t("donationPersonal.Дней осталось")}
                        text={daysLeft}
                        className={styles.infoCard}
                    />
                )}
                {percentAmountCollect && (
                    <InfoCardItem
                        title={isSuccess ? t("donationPersonal.Проект собрал") : t("donationPersonal.Средств собрано")}
                        text={`${percentAmountCollect}%/${amount} ₽`}
                        className={styles.infoCard}
                    >
                        <DonationProgressBar value={percentAmountCollect} isSuccess={isSuccess} />
                    </InfoCardItem>
                )}
            </InfoCard>
        </div>
    );
});
