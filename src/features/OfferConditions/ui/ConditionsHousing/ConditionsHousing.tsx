import { memo, useCallback } from "react";

import { useTranslation } from "react-i18next";

import SwitchComponent from "@/shared/ui/Switch/Switch";

import { useConditionItems } from "../../model/data/conditionItems";
import { HousingFields } from "../../model/types/offerConditions";
import { ConditionsItem } from "../ConditionsItem/ConditionsItem";
import { House } from "@/shared/data/conditions";
import styles from "./ConditionsHousing.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

export interface ConditionsHousingProps {
    houseData: House[];
    isLoading: boolean;
    value: HousingFields;
    onChange: (value: HousingFields) => void;
}

export const ConditionsHousing = memo((props: ConditionsHousingProps) => {
    const {
        houseData, isLoading, onChange, value,
    } = props;
    const { t } = useTranslation("offer");
    const { getTranslation } = useConditionItems();

    const onSwitchChange = useCallback(() => {
        const newSwitchState = !value.switchState;
        onChange({
            ...value,
            switchState: newSwitchState,
            housing: !newSwitchState ? [] : value.housing,
        });
    }, [value, onChange]);

    const onToggleCondition = (conditionId: number) => {
        if (value.switchState) {
            const newHousing = value.housing.includes(conditionId)
                ? value.housing.filter((id) => id !== conditionId)
                : [...value.housing, conditionId];
            onChange({
                ...value,
                housing: newHousing,
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
                {isLoading ? (
                    <MiniLoader />
                ) : (
                    <>
                        {houseData.map((item) => (
                            <ConditionsItem
                                checked={value.housing.includes(item.id)}
                                onToggle={() => onToggleCondition(item.id)}
                                key={item.id}
                                text={getTranslation(item.name) ?? ""}
                                icon={getMediaContent(item.imagePath) ?? ""}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
});
