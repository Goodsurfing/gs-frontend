import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./VolunteerDesctiptionCard.module.scss";

interface VolunteerDesctiptionCardProps {
    title: string;
    description?: string;
    className?: string;
    // Компонент переиспользуется дважды на странице (О себе + Доп.
    // информация) — id-якорь для навигации по submenuData нужен только
    // одному из них, иначе на странице оказывались два элемента с
    // одинаковым id.
    id?: string;
}

export const VolunteerDesctiptionCard: FC<VolunteerDesctiptionCardProps> = memo(
    (props: VolunteerDesctiptionCardProps) => {
        const {
            title, description, className, id,
        } = props;
        const { t } = useTranslation("profile");

        return (
            <div id={id} className={className}>
                <Text title={title} titleSize="h3" />
                <p className={styles.description}>{description || t("personal.Пользователь не указал информацию о себе")}</p>
            </div>
        );
    },
);
