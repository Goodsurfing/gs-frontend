import cn from "classnames";
import React, { FC, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Skill } from "@/types/skills";

import additionalSkillIcon from "@/shared/assets/icons/skills/success.svg";
import { useSkillsData } from "@/shared/data/skills";
import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";
import { Text } from "@/shared/ui/Text/Text";

import styles from "./VolunteerSkillsCard.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface VolunteerSkillsCardProps {
    skills?: Skill[];
    additionalSkills?: string[];
    className?: string;
}

export const VolunteerSkillsCard: FC<VolunteerSkillsCardProps> = memo(
    (props: VolunteerSkillsCardProps) => {
        const { skills, additionalSkills, className } = props;
        const { getTranslation } = useSkillsData();
        const { t } = useTranslation("profile");

        const renderSkillsCard = useMemo(() => {
            if (!skills || skills.length === 0) {
                return <span>{t("personal.Пользователь не указал умения")}</span>;
            }

            return skills.map((item) => (
                <IconTextComponent
                    text={getTranslation(item.name) ?? ""}
                    icon={getMediaContent(item.imagePath) ?? ""}
                    alt={item.name}
                    key={item.id}
                />
            ));
        }, [getTranslation, skills, t]);

        const renderAdditionalSkills = useMemo(() => {
            if (!additionalSkills || additionalSkills.length === 0) {
                return <span>{t("personal.Пользователь не указал дополнительные умения")}</span>;
            }
            const renderAdditionSkils = additionalSkills.map((skill, index) => (
                <IconTextComponent
                    text={skill}
                    icon={additionalSkillIcon}
                    alt={skill}
                    key={index}
                />
            ));
            return <div className={styles.cards}>{renderAdditionSkils}</div>;
        }, [additionalSkills, t]);

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.card}>
                    <Text title={t("personal.Умения")} titleSize="h3" />
                    <div className={styles.cards}>{renderSkillsCard}</div>
                </div>
                <div className={styles.card}>
                    <Text title={t("personal.Дополнительные умения")} titleSize="h3" />
                    {renderAdditionalSkills}
                </div>
            </div>
        );
    },
);
