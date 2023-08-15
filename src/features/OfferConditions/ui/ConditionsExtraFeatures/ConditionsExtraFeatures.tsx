import { ExtraFeatures } from "@/entities/Offer";
import { extraAvailiablesItems } from "../../model/data/conditionItems";
import { ConditionsItem } from "../ConditionsItem/ConditionsItem";
import { ExtraFeaturesFields } from "../../model/types/offerConditions";

import styles from "./ConditionsExtraFeatures.module.scss";

interface ConditionsExtraFeaturesProps {
    value: ExtraFeaturesFields;
    onChange: (value: ExtraFeaturesFields) => void;
}

export const ConditionsExtraFeatures = (props: ConditionsExtraFeaturesProps) => {
    const { onChange, value } = props;

    const onConditionToggle = (conditionId: ExtraFeatures) => {
        const activeIndex = value.extraFeatures.findIndex((item) => item === conditionId);
        if (activeIndex !== -1) {
            onChange({
                ...value,
                extraFeatures: [...value.extraFeatures.filter((val) => val !== conditionId)],
            });
        } else {
            onChange({
                ...value,
                extraFeatures: [...value.extraFeatures, conditionId],
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            <p className={styles.title}>Дополнительные возможности</p>
            <div className={styles.conditions}>
                {extraAvailiablesItems.map((item) => (
                    <ConditionsItem
                        checked={!!value.extraFeatures.find((val) => val === item.id)}
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
