import { useTranslation } from "react-i18next";
import { ExtraFeatures } from "@/entities/Offer";
import { useConditionItems } from "../../model/data/conditionItems";
import { ConditionsItem } from "../ConditionsItem/ConditionsItem";
import { ExtraFeaturesFields } from "../../model/types/offerConditions";

import styles from "./ConditionsExtraFeatures.module.scss";

interface ConditionsExtraFeaturesProps {
    value: ExtraFeaturesFields;
    onChange: (value: ExtraFeaturesFields) => void;
}

export const ConditionsExtraFeatures = (props: ConditionsExtraFeaturesProps) => {
    const { onChange, value } = props;
    const { extraAvailiablesItems } = useConditionItems();
    const { t } = useTranslation("offer");

    const onConditionToggle = (conditionId: ExtraFeatures) => {
        const current = value.extraFeatures ?? [];
        const isActive = current.includes(conditionId);

        const newExtraFeatures = isActive
            ? current.filter((val) => val !== conditionId)
            : [...current, conditionId];

        onChange({
            ...value,
            extraFeatures: newExtraFeatures,
        });
    };

    return (
        <div className={styles.wrapper}>
            <p className={styles.title}>{t("conditions.Дополнительные возможности")}</p>
            <div className={styles.conditions}>
                {extraAvailiablesItems.map((item) => (
                    <ConditionsItem
                        checked={!!value.extraFeatures?.find((val) => val === item.id)}
                        icon={item.icon}
                        onToggle={() => onConditionToggle(item.id)}
                        text={item.text}
                        key={item.id}
                    />
                ))}
            </div>
        </div>
    );
};
