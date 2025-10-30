import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./VolunteerDesctiptionCard.module.scss";

interface VolunteerDesctiptionCardProps {
    description?: string;
}

export const VolunteerDesctiptionCard: FC<VolunteerDesctiptionCardProps> = memo(
    (props: VolunteerDesctiptionCardProps) => {
        const { description } = props;
        const { t } = useTranslation("profile");

        return (
            <div id="1">
                <Text title={t("personal.О себе")} titleSize="h3" />
                <p className={styles.description}>{description || t("personal.Пользователь не указал информацию о себе")}</p>
            </div>
        );
    },
);
