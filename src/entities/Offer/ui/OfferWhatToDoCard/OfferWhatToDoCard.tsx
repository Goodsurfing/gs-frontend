import cn from "classnames";
import React, {
    FC, memo, useMemo,
} from "react";

import { useTranslation } from "react-i18next";
import { Skills, SkillsData, useSkillsData } from "@/shared/data/skills";
import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";
import { Text } from "@/shared/ui/Text/Text";

import { OfferWhatToDo } from "../../model/types/offerWhatToDo";
import { InfoCard, InfoCardItem } from "@/shared/ui/InfoCard/InfoCard";
import styles from "./OfferWhatToDoCard.module.scss";
import { useTranslateTimeType } from "@/shared/hooks/useTimeType";
import { successIcon } from "@/shared/data/icons/skills";

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
            whatToDo: {
                skills, hours, dayOff, timeType, additionalSkills, externalInfo,
            },
            className,
        } = props;
        const { skillsData } = useSkillsData();
        const translateTimeType = useTranslateTimeType();
        const { t } = useTranslation("offer");

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
        }, [skills, skillsData]);

        const renderAdditionalSkillsCard = useMemo(() => {
            if (!additionalSkills) return null;
            return additionalSkills.map((item, index) => (
                <IconTextComponent
                    text={item}
                    icon={successIcon}
                    alt={item}
                    key={index}
                />
            ));
        }, [additionalSkills]);

        return (
            <div className={cn(className, styles.wrapper)} id="whatToDo">
                <div className={styles.card}>
                    <Text title={t("personalOffer.Требования к участнику")} titleSize="h3" />
                    <div className={styles.cards}>{renderSkillsCard}</div>
                    <Text title={t("personalOffer.Дополнительные требования")} titleSize="h3" />
                    <div className={styles.cards}>{renderAdditionalSkillsCard}</div>
                    <Text title={t("personalOffer.Дополнительная информация")} titleSize="h3" />
                    <p>{externalInfo}</p>
                </div>
                <div className={styles.card}>
                    <InfoCard>
                        <InfoCardItem
                            className={styles.left}
                            title={t("personalOffer.Количество рабочих часов")}
                            text={`${hours} ${translateTimeType(timeType)}`}
                        />
                        <InfoCardItem
                            className={styles.right}
                            title={t("personalOffer.Выходных дней в неделю")}
                            text={dayOff}
                        />
                    </InfoCard>
                </div>
            </div>
        );
    },
);
