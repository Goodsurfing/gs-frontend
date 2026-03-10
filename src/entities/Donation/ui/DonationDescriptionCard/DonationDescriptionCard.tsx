import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./DonationDescriptionCard.module.scss";

interface DonationDescriptionCardProps {
    className?: string;
    description: string | null;
}

export const DonationDescriptionCard: FC<DonationDescriptionCardProps> = memo(
    (props: DonationDescriptionCardProps) => {
        const { className, description } = props;
        const { t } = useTranslation("donation");
        const text = (description === "" || description === null) ? t("donationPersonal.Описание не было заполнено") : description;

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.container}>
                    <Text title={t("donationPersonal.Описание")} titleSize="h3" />
                    <p className={styles.description}>
                        {text}
                    </p>
                </div>
            </div>
        );
    },
);
