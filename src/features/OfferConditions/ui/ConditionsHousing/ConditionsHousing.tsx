import { memo, useCallback } from "react";

import { useTranslation } from "react-i18next";
import { Housing } from "@/entities/Offer";

import SwitchComponent from "@/shared/ui/Switch/Switch";

import { useConditionItems } from "../../model/data/conditionItems";
import { HousingFields } from "../../model/types/offerConditions";
import { ConditionsItem } from "../ConditionsItem/ConditionsItem";
import styles from "./ConditionsHousing.module.scss";

export interface ConditionsHousingProps {
    value: HousingFields;
    onChange: (value: HousingFields) => void;
}

export const ConditionsHousing = memo((props: ConditionsHousingProps) => {
    const { onChange, value } = props;
    const { t } = useTranslation("offer");
    const { liveItems } = useConditionItems();

    const onSwitchChange = useCallback(() => {
        const newSwitchState = !value.switchState;
        onChange({
            ...value,
            switchState: newSwitchState,
            housing: !newSwitchState ? undefined : value.housing,
        });
    }, [value, onChange]);

    const onToggleCondition = (conditionId: Housing) => {
        if (value.switchState) {
            onChange({
                ...value,
                housing: conditionId,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.toggleWrapper}>
                <label className={styles.toggleText} htmlFor="housing">
                    {t("conditions.Жилье")}
                </label>
                <div className={styles.toggle}>
                    <span className={styles.toggleSpan}>{t("conditions.Нет")}</span>
                    <SwitchComponent
                        id="housing"
                        checked={value.switchState}
                        onClick={onSwitchChange}
                    />
                    <span className={styles.toggleSpan}>{t("conditions.Да")}</span>
                </div>
            </div>
            <div className={styles.conditions}>
                {liveItems.map((item) => (
                    <ConditionsItem
                        checked={value.housing === item.id}
                        onToggle={() => onToggleCondition(item.id)}
                        key={item.id}
                        text={item.text}
                        icon={item.icon}
                    />
                ))}
            </div>
        </div>
    );
});
