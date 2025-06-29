import cn from "classnames";
import React, { FC, memo, useMemo } from "react";
import { WhatToDoSkillType } from "@/types/skills";

import additionalSkillIcon from "@/shared/assets/icons/skills/success.svg";
import { Skills, SkillsData, useSkillsData } from "@/shared/data/skills";
import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";
import { Text } from "@/shared/ui/Text/Text";

import styles from "./VolunteerSkillsCard.module.scss";

interface VolunteerSkillsCardProps {
    skills?: WhatToDoSkillType[];
    additionalSkills?: string[];
    className?: string;
}

type SkillsMap = {
    [key in Skills]?: SkillsData;
};

export const VolunteerSkillsCard: FC<VolunteerSkillsCardProps> = memo(
    (props: VolunteerSkillsCardProps) => {
        const { skills, additionalSkills, className } = props;
        const { skillsData } = useSkillsData();

        const renderSkillsCard = useMemo(() => {
            if (!skills || skills.length === 0) {
                return <span>Волонтёр не указал умения</span>;
            }

            const skillsMap: SkillsMap = skillsData.reduce(
                (acc: SkillsMap, cur) => {
                    acc[cur.id] = cur;
                    return acc;
                },
                {},
            );
            return skills.map((item) => {
                const skill = skillsMap[item];
                return (
                    skill && (
                        <IconTextComponent
                            text={skill.text}
                            icon={skill.icon}
                            alt={skill.text}
                            key={skill.id}
                        />
                    )
                );
            });
        }, [skills, skillsData]);

        const renderAdditionalSkills = useMemo(() => {
            if (!additionalSkills || additionalSkills.length === 0) {
                return <span>Волонтёр не указал дополнительные умения</span>;
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
        }, [additionalSkills]);

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.card}>
                    <Text title="Умения" titleSize="h3" />
                    <div className={styles.cards}>{renderSkillsCard}</div>
                </div>
                <div className={styles.card}>
                    <Text title="Дополнительные умения" titleSize="h3" />
                    {renderAdditionalSkills}
                </div>
            </div>
        );
    },
);
