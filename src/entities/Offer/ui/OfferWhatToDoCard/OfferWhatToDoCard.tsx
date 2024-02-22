import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { Skills, SkillsData, skillsData } from "@/shared/data/skills";
import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";
import { Text } from "@/shared/ui/Text/Text";

import { OfferWhatToDo } from "../../model/types/offerWhatToDo";
import { InfoCard, InfoCardItem } from "@/shared/ui/InfoCard/InfoCard";
import styles from "./OfferWhatToDoCard.module.scss";

interface OfferWhatToDoCardProps {
    whatToDo: OfferWhatToDo;
    className?: string;
}

type SkillsMap = {
    [key in Skills]?: SkillsData;
};

export const OfferWhatToDoCard: FC<OfferWhatToDoCardProps> = memo(
    (props: OfferWhatToDoCardProps) => {
        const {
            whatToDo: { skills, workingHours },
            className,
        } = props;

        const renderSkillsCard = useMemo(() => {
            const skillsMap: SkillsMap = skillsData.reduce(
                (acc: SkillsMap, cur) => {
                    acc[cur.id] = cur;
                    return acc;
                },
                {},
            );
            return skills.map((item) => {
                const skill = skillsMap[item.text];
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
        }, [skills]);

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.card}>
                    <Text title="Требования к участнику" titleSize="h3" />
                    <div className={styles.cards}>{renderSkillsCard}</div>
                </div>
                <div className={styles.card}>
                    <InfoCard>
                        <InfoCardItem
                            className={styles.left}
                            title="Количество рабочих часов"
                            text={`${workingHours.hours} в неделю`}
                        />
                        <InfoCardItem
                            className={styles.right}
                            title="Выходных дней в неделю"
                            text={workingHours.dayOff}
                        />
                    </InfoCard>
                </div>
            </div>
        );
    },
);
