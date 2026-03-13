import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";

import { Locale } from "@/entities/Locale";
import { DonationCard, DonationCardType } from "../DonationCard/DonationCard";
import Button from "@/shared/ui/Button/Button";
import styles from "./VolunteerDonationCard.module.scss";

interface VolunteerDonationCardProps {
    data: DonationCardType;
    className?: string;
    locale: Locale;
}

export const VolunteerDonationCard: FC<VolunteerDonationCardProps> = memo(
    (props: VolunteerDonationCardProps) => {
        const {
            data,
            className,
            locale,
        } = props;

        const { t } = useTranslation("donation");

        return (
            <div
                className={cn(styles.wrapper, className)}
            >
                <DonationCard data={data} locale={locale} className={styles.cardWrapper} />
                <Button
                    color="GREEN"
                    size="SMALL"
                    variant="FILL"
                    className={styles.button}
                >
                    {t("donationRecommendation.Поддержать")}

                </Button>
            </div>
        );
    },
);
