import { memo, useCallback } from "react";
import { HousingFields } from "../../model/types/offerConditions";
import SwitchComponent from "@/shared/ui/Switch/Switch";

import styles from "./ConditionsHousing.module.scss";
import { ConditionsItem } from "../ConditionsItem/ConditionsItem";
import { liveItems } from "../../model/data/conditionItems";
import { Housing } from "@/entities/Offer";

export interface ConditionsHousingProps {
    value: HousingFields;
    onChange: (value: HousingFields) => void;
}

export const ConditionsHousing = memo((props: ConditionsHousingProps) => {
    const { onChange, value } = props;

    const onSwitchChange = useCallback(() => {
        onChange({ ...value, switchState: !value.switchState });
    }, [value, onChange]);

    const onToggleCondition = (conditionId: Housing) => {
        onChange({ ...value, housing: conditionId });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.toggleWrapper}>
                <label className={styles.toggleText} htmlFor="housing">Жилье</label>
                <div className={styles.toggle}>
                    <span className={styles.toggleSpan}>Нет</span>
                    <SwitchComponent
                        id="housing"
                        checked={value.switchState}
                        onClick={onSwitchChange}
                    />
                    <span className={styles.toggleSpan}>Да</span>
                </div>
            </div>
            <div className={styles.conditions}>
                {liveItems.map((item) => (
                    <ConditionsItem
                        checked={value.housing === item.id}
                        key={item.id}
                        text={item.text}
                        icon={item.icon}
                        onToggle={() => onToggleCondition(item.id as Housing)}
                    />
                ))}
            </div>
        </div>
    );
});
