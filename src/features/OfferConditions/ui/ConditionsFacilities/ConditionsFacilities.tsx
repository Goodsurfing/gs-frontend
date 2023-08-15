import { Facilities } from "@/entities/Offer";
import { goodsItems } from "../../model/data/conditionItems";
import { FacilitiesFields } from "../../model/types/offerConditions";
import { ConditionsItem } from "../ConditionsItem/ConditionsItem";

import styles from "./ConditionsFacilities.module.scss";

interface ConditionsFacilitiesProps {
    value: FacilitiesFields;
    onChange: (value: FacilitiesFields) => void;
}

export const ConditionsFacilities = (props: ConditionsFacilitiesProps) => {
    const { onChange, value } = props;

    const onConditionToggle = (conditionId: Facilities) => {
        const activeIndex = value.facilities.findIndex((item) => item === conditionId);
        if (activeIndex !== -1) {
            onChange({
                ...value,
                facilities: [...value.facilities.filter((val) => val !== conditionId)],
            });
        } else {
            onChange({
                ...value,
                facilities: [...value.facilities, conditionId],
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            <p className={styles.title}>Удобства</p>
            <div className={styles.conditions}>
                {goodsItems.map((item) => (
                    <ConditionsItem
                        checked={!!value.facilities.find((val) => val === item.id)}
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
