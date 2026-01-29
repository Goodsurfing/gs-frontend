import { memo } from "react";

import { useTranslation } from "react-i18next";

import SwitchComponent from "@/shared/ui/Switch/Switch";

import { NutritionFields } from "../../model/types/offerConditions";
import { ConditionsItem } from "../ConditionsItem/ConditionsItem";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Food } from "@/shared/data/conditions";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./ConditionsNutrition.module.scss";

interface ConditionsNutritionProps {
    foodData: Food[];
    isLoading: boolean;
    value: NutritionFields;
    onChange: (value: NutritionFields) => void;
}

export const ConditionsNutrition = memo((props: ConditionsNutritionProps) => {
    const {
        foodData, isLoading, onChange, value,
    } = props;
    const { t } = useTranslation("offer");

    const onToggleCondition = (conditionId: number) => {
        if (value.switchState) {
            const newNutrition = value.nutrition.includes(conditionId)
                ? value.nutrition.filter((id) => id !== conditionId)
                : [...value.nutrition, conditionId];
            onChange({
                ...value,
                nutrition: newNutrition,
            });
        }
    };

    const onSwitchChange = () => {
        const newSwitchState = !value.switchState;
        onChange({
            ...value,
            switchState: newSwitchState,
            nutrition: !newSwitchState ? [] : value.nutrition,
        });
    };

    const onCancelClick = () => {
        onChange({
            ...value,
            switchState: false,
            nutrition: [],
        });
    };

    const onApplyClick = () => {
        onChange({ ...value, switchState: true });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.toggleWrapper}>
                <p className={styles.toggleText}>{t("conditions.Питание")}</p>
                <div className={styles.toggle}>
                    <span onClick={onCancelClick} className={styles.toggleSpan}>
                        {t("conditions.Нет")}
                    </span>
                    <SwitchComponent
                        id="nutrition"
                        checked={value.switchState}
                        onClick={onSwitchChange}
                    />
                    <span onClick={onApplyClick} className={styles.toggleSpan}>
                        {t("conditions.Да")}
                    </span>
                </div>
            </div>
            <div className={styles.conditions}>
                {isLoading ? (
                    <MiniLoader />
                ) : (
                    <>
                        {foodData.map((item) => (
                            <ConditionsItem
                                checked={value.nutrition.includes(item.id)}
                                onToggle={() => onToggleCondition(item.id)}
                                key={item.id}
                                text={item.name}
                                icon={getMediaContent(item.imagePath) ?? ""}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
});
