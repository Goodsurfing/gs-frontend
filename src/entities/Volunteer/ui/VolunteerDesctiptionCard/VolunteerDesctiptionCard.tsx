import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./VolunteerDesctiptionCard.module.scss";

interface VolunteerDesctiptionCardProps {
    title: string;
    description?: string;
    className?: string
}

export const VolunteerDesctiptionCard: FC<VolunteerDesctiptionCardProps> = memo(
    (props: VolunteerDesctiptionCardProps) => {
        const { title, description, className } = props;
        const { t } = useTranslation("profile");

        return (
            <div id="1" className={className}>
                <Text title={title} titleSize="h3" />
                <p className={styles.description}>{description || t("personal.Пользователь не указал информацию о себе")}</p>
            </div>
        );
    },
);
