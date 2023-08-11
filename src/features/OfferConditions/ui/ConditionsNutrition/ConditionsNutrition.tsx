import { memo } from "react";
import { Nutrition } from "@/entities/Offer";
import { foodItems } from "../../model/data/conditionItems";
import { ConditionsItem } from "../ConditionsItem/ConditionsItem";
import { NutritionFields } from "../../model/types/offerConditions";

import styles from "./ConditionsNutrition.module.scss";
import SwitchComponent from "@/shared/ui/Switch/Switch";

interface ConditionsNutritionProps {
    value: NutritionFields;
    onChange: (value: NutritionFields) => void;
}

export const ConditionsNutrition = memo((props: ConditionsNutritionProps) => {
    const { onChange, value } = props;

    const onToggleCondition = (nutritionType: Nutrition) => {
        const activeIndex = value.nutrition.findIndex((item) => item === nutritionType);
        if (activeIndex !== -1) {
            onChange({
                ...value,
                nutrition: [...value.nutrition.filter((val) => val !== nutritionType)],
            });
        } else {
            onChange({
                ...value,
                nutrition: [...value.nutrition, nutritionType],
            });
        }
    };

    const onSwitchChange = () => {
        onChange({ ...value, switchState: !value.switchState });
    };

    const onCancelClick = () => {
        onChange({ ...value, switchState: false });
    };

    const onApplyClick = () => {
        onChange({ ...value, switchState: true });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.toggleWrapper}>
                <p className={styles.toggleText}>Питание</p>
                <div className={styles.toggle}>
                    <span onClick={onCancelClick} className={styles.toggleSpan}>Нет</span>
                    <SwitchComponent
                        id="nutrition"
                        checked={value.switchState}
                        onClick={onSwitchChange}
                    />
                    <span onClick={onApplyClick} className={styles.toggleSpan}>Да</span>
                </div>
            </div>
            <div className={styles.conditions}>
                {foodItems.map((item) => (
                    <ConditionsItem
                        checked={!!value.nutrition?.find((val) => val === item.id)}
                        icon={item.icon}
                        onToggle={() => onToggleCondition(item.id)}
                        text={item.text}
                        key={item.id}
                    />
                ))}
            </div>
        </div>
    );
});
