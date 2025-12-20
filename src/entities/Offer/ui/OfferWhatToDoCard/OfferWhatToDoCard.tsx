import cn from "classnames";
import React, {
    FC, memo, useMemo,
} from "react";

import { useTranslation } from "react-i18next";
import { useSkillsData } from "@/shared/data/skills";
import { IconTextComponent } from "@/shared/ui/IconTextComponent/IconTextComponent";
import { Text } from "@/shared/ui/Text/Text";

import { OfferWhatToDo } from "../../model/types/offerWhatToDo";
import { InfoCard, InfoCardItem } from "@/shared/ui/InfoCard/InfoCard";
import styles from "./OfferWhatToDoCard.module.scss";
import { useTranslateTimeType } from "@/shared/hooks/useTimeType";
import { successIcon } from "@/shared/data/icons/skills";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface OfferWhatToDoCardProps {
    whatToDo: OfferWhatToDo;
    className?: string;
}

export const OfferWhatToDoCard: FC<OfferWhatToDoCardProps> = memo(
    (props: OfferWhatToDoCardProps) => {
        const {
            whatToDo: {
                skills, hour, dayOff, timeType, additionalSkills, externalInfo,
            },
            className,
        } = props;
        const { getTranslation } = useSkillsData();
        const translateTimeType = useTranslateTimeType();
        const { t } = useTranslation("offer");

        const renderSkillsCard = useMemo(() => skills.map((item) => (
            <IconTextComponent
                text={getTranslation(item.name) ?? ""}
                icon={getMediaContent(item.image.contentUrl) ?? ""}
                alt={item.name}
                key={item.id}
            />
        )), [getTranslation, skills]);

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
                    {skills.length > 0 && (
                        <>
                            <Text title={t("personalOffer.Требования к участнику")} titleSize="h3" />
                            <div className={styles.cards}>{renderSkillsCard}</div>
                        </>
                    )}
                    {additionalSkills.length > 0 && (
                        <>
                            <Text title={t("personalOffer.Дополнительные требования")} titleSize="h3" />
                            <div className={styles.cards}>{renderAdditionalSkillsCard}</div>
                        </>
                    )}
                    {externalInfo !== "" && (
                        <>
                            <Text title={t("personalOffer.Дополнительная информация")} titleSize="h3" />
                            <p>{externalInfo}</p>
                        </>
                    )}
                </div>
                <div className={styles.card}>
                    <InfoCard>
                        <InfoCardItem
                            className={styles.left}
                            title={t("personalOffer.Количество рабочих часов")}
                            text={`${hour} ${translateTimeType(timeType)}`}
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
