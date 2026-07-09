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
    collectedAmount: number;
    amount: number | null;
    isSuccess: boolean;
}

const fmt = new Intl.NumberFormat("ru-RU");

export const DonationWhenCard = memo((props: DonationWhenCardProps) => {
    const {
        className,
        dateStart,
        daysLeft,
        amount,
        percentAmountCollect,
        collectedAmount,
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

    const hasTargetAmount = amount !== null && amount > 0;
    const showProgress = collectedAmount > 0 || hasTargetAmount;
    const getProgressText = () => {
        if (!showProgress) return null;
        if (hasTargetAmount) {
            return `${fmt.format(collectedAmount)} ₽ / ${fmt.format(amount)} ₽ (${percentAmountCollect ?? 0}%)`;
        }
        return `${fmt.format(collectedAmount)} ₽`;
    };
    const progressText = getProgressText();

    return (
        <div className={cn(className)} id="description">
            <InfoCard className={styles.wrapper}>
                <InfoCardItem
                    title={t("donationPersonal.Дата старта")}
                    className={styles.infoCard}
                >
                    {donationDateStart()}
                </InfoCardItem>
                {(daysLeft !== null && !isSuccess) && (
                    <InfoCardItem
                        title={t("donationPersonal.Дней осталось")}
                        text={daysLeft}
                        className={styles.infoCard}
                    />
                )}
                {showProgress && (
                    <InfoCardItem
                        title={isSuccess
                            ? t("donationPersonal.Проект собрал")
                            : t("donationPersonal.Средств собрано")}
                        text={progressText ?? undefined}
                        className={styles.infoCard}
                    >
                        <DonationProgressBar
                            value={percentAmountCollect ?? 0}
                            isSuccess={isSuccess}
                        />
                    </InfoCardItem>
                )}
            </InfoCard>
        </div>
    );
});
