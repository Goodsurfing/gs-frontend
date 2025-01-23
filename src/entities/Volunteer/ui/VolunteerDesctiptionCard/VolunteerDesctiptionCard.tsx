import React, { FC, memo } from "react";

import styles from "./VolunteerDesctiptionCard.module.scss";
import { Text } from "@/shared/ui/Text/Text";

interface VolunteerDesctiptionCardProps {
    description?: string;
}

export const VolunteerDesctiptionCard: FC<VolunteerDesctiptionCardProps> = memo(
    (props: VolunteerDesctiptionCardProps) => {
        const { description } = props;
        return (
            <div id="1">
                <Text title="О себе" titleSize="h3" />
                <p className={styles.description}>{description || "Волонтёр не указал информацию о себе"}</p>
            </div>
        );
    },
);
