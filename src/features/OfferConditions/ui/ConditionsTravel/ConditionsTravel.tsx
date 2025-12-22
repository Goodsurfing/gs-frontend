import { useTranslation } from "react-i18next";
import SwitchComponent from "@/shared/ui/Switch/Switch";
import { TravelFields } from "../../model/types/offerConditions";

import { ConditionsItem } from "../ConditionsItem/ConditionsItem";
import { useConditionItems } from "../../model/data/conditionItems";
import { Transfer } from "@/shared/data/conditions";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./ConditionsTravel.module.scss";

interface ConditionsTravelProps {
    transferData: Transfer[];
    isLoading: boolean;
    value: TravelFields;
    onChange: (value: TravelFields) => void;
}

export const ConditionsTravel = (props: ConditionsTravelProps) => {
    const {
        transferData, isLoading, onChange, value,
    } = props;
    const { t } = useTranslation("offer");
    const { getTranslation } = useConditionItems();

    const onSwitchChange = () => {
        const newSwitchState = !value.switchState;
        onChange({
            ...value,
            switchState: newSwitchState,
            travel: !newSwitchState ? [] : value.travel,
        });
    };

    const onToggleCondition = (conditionId: number) => {
        if (value.switchState) {
            const newHousing = value.travel.includes(conditionId)
                ? value.travel.filter((id) => id !== conditionId)
                : [...value.travel, conditionId];
            onChange({
                ...value,
                travel: newHousing,
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.toggleWrapper}>
                <p className={styles.toggleText}>{t("conditions.Оплачиваемый проезд")}</p>
                <div className={styles.toggle}>
                    <span className={styles.toggleSpan}>{t("conditions.Нет")}</span>
                    <SwitchComponent
                        id="travel"
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
                        {transferData.map((item) => (
                            <ConditionsItem
                                checked={value.travel.includes(item.id)}
                                icon={getMediaContent(item.imagePath) ?? ""}
                                onToggle={() => onToggleCondition(item.id)}
                                text={getTranslation(item.name) ?? ""}
                                key={item.id}
                            />
                        ))}
                    </>
                )}

            </div>
        </div>
    );
};
