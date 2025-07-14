import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import styles from "./VolunteerDesctiptionCard.module.scss";
import { Text } from "@/shared/ui/Text/Text";

interface VolunteerDesctiptionCardProps {
    description?: string;
}

export const VolunteerDesctiptionCard: FC<VolunteerDesctiptionCardProps> = memo(
    (props: VolunteerDesctiptionCardProps) => {
        const { description } = props;
        const { t } = useTranslation("volunteer");

        return (
            <div id="1">
                <Text title={t("personalVolunteer.О себе")} titleSize="h3" />
                <p className={styles.description}>{description || t("personalVolunteer.Волонтёр не указал информацию о себе")}</p>
            </div>
        );
    },
);
