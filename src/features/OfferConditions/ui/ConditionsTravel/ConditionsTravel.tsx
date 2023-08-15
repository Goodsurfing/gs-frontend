import SwitchComponent from "@/shared/ui/Switch/Switch";
import { TravelFields } from "../../model/types/offerConditions";

import styles from "./ConditionsTravel.module.scss";
import { ConditionsItem } from "../ConditionsItem/ConditionsItem";
import { Travel } from "@/entities/Offer";
import { payedRideItems } from "../../model/data/conditionItems";

interface ConditionsTravelProps {
    value: TravelFields;
    onChange: (value: TravelFields) => void;
}

export const ConditionsTravel = (props: ConditionsTravelProps) => {
    const { onChange, value } = props;

    const onSwitchChange = () => {
        onChange({ ...value, switchState: !value.switchState });
    };

    const onToggleCondition = (conditionId: Travel) => {
        const activeIndex = value.travel.findIndex((item) => item === conditionId);
        if (activeIndex !== -1) {
            onChange({
                ...value,
                travel: [...value.travel.filter((val) => val !== conditionId)],
            });
        } else {
            onChange({
                ...value,
                travel: [...value.travel, conditionId],
            });
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.toggleWrapper}>
                <p className={styles.toggleText}>Оплачиваемый проезд</p>
                <div className={styles.toggle}>
                    <span className={styles.toggleSpan}>Нет</span>
                    <SwitchComponent
                        id="travel"
                        checked={value.switchState}
                        onClick={onSwitchChange}
                    />
                    <span className={styles.toggleSpan}>Да</span>
                </div>
            </div>
            <div className={styles.conditions}>
                {payedRideItems.map((item) => (
                    <ConditionsItem
                        checked={!!value.travel?.find((val) => val === item.id)}
                        icon={item.icon}
                        onToggle={() => onToggleCondition(item.id)}
                        text={item.text}
                        key={item.id}
                    />
                ))}
            </div>
        </div>
    );
};
