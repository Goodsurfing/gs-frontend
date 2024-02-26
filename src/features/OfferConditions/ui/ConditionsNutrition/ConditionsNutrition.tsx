import { memo } from "react";

import { Nutrition } from "@/entities/Offer";

import SwitchComponent from "@/shared/ui/Switch/Switch";

import { foodItems } from "../../model/data/conditionItems";
import { NutritionFields } from "../../model/types/offerConditions";
import { ConditionsItemsList } from "../ConditionsItemList/ConditionsItemsList";
import styles from "./ConditionsNutrition.module.scss";

interface ConditionsNutritionProps {
    value: NutritionFields;
    onChange: (value: NutritionFields) => void;
}

export const ConditionsNutrition = memo((props: ConditionsNutritionProps) => {
    const { onChange, value } = props;

    const onToggleCondition = (nutrition: Nutrition) => {
        if (value.switchState) {
            onChange({ ...value, nutrition });
        }
    };

    const onSwitchChange = () => {
        const newSwitchState = !value.switchState;
        onChange({
            ...value,
            switchState: newSwitchState,
            nutrition: !newSwitchState ? undefined : value.nutrition,
        });
    };

    const onCancelClick = () => {
        onChange({
            ...value,
            switchState: false,
            nutrition: undefined,
        });
    };

    const onApplyClick = () => {
        onChange({ ...value, switchState: true });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.toggleWrapper}>
                <p className={styles.toggleText}>Питание</p>
                <div className={styles.toggle}>
                    <span onClick={onCancelClick} className={styles.toggleSpan}>
                        Нет
                    </span>
                    <SwitchComponent
                        id="nutrition"
                        checked={value.switchState}
                        onClick={onSwitchChange}
                    />
                    <span onClick={onApplyClick} className={styles.toggleSpan}>
                        Да
                    </span>
                </div>
            </div>
            <div className={styles.conditions}>
                <ConditionsItemsList
                    items={foodItems}
                    value={value.nutrition}
                    onChange={onToggleCondition}
                />
            </div>
        </div>
    );
});
