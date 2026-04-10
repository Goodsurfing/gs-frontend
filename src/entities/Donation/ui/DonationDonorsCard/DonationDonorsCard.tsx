import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { useGetDonationsByFundraiseQuery } from "@/store/api/donationPaymentApi";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

import styles from "./DonationDonorsCard.module.scss";

interface DonationDonorsCardProps {
    className?: string;
    fundraiseId: string;
}

export const DonationDonorsCard = memo((props: DonationDonorsCardProps) => {
    const { className, fundraiseId } = props;
    const { t } = useTranslation("donation");

    const { data, isLoading } = useGetDonationsByFundraiseQuery({
        fundraiseId,
        page: 1,
        limit: 10,
    });

    if (isLoading) {
        return <MiniLoader />;
    }

    if (!data || data.donationCount === 0) {
        return (
            <div className={cn(className, styles.wrapper)}>
                <h3 className={styles.title}>
                    {t("donationPersonal.Участники сбора")}
                </h3>
                <p className={styles.empty}>
                    {t("donationPersonal.Пока нет пожертвований")}
                </p>
            </div>
        );
    }

    const formatAmount = (amount: number) => amount.toLocaleString("ru-RU");

    return (
        <div className={cn(className, styles.wrapper)}>
            <h3 className={styles.title}>
                {t("donationPersonal.Участники сбора")}
            </h3>
            <div className={styles.stats}>
                <span className={styles.stat}>
                    {t("donationPersonal.Всего")}
                    :
                    {" "}
                    <span className={styles.statValue}>{data.donationCount}</span>
                </span>
                <span className={styles.stat}>
                    {t("donationPersonal.Собрано")}
                    :
                    {" "}
                    <span className={styles.statValue}>
                        {formatAmount(data.collectedAmount)}
                        {" "}
                        ₽
                    </span>
                </span>
            </div>
            <div className={styles.list}>
                {data.data.map((donor) => (
                    <div key={donor.id} className={styles.item}>
                        <div className={styles.donorInfo}>
                            <span className={styles.donorName}>
                                {donor.isAnonymous
                                    ? t("donationPersonal.Аноним")
                                    : donor.fullName || t("donationPersonal.Аноним")}
                            </span>
                            <span className={styles.donorDate}>
                                {new Date(donor.createdAt).toLocaleDateString("ru-RU")}
                            </span>
                        </div>
                        <span className={styles.amount}>
                            {formatAmount(donor.amount)}
                            {" "}
                            ₽
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
});
