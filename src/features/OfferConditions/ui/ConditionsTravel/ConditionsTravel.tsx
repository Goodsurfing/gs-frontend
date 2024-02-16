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
        const newSwitchState = !value.switchState;
        onChange({
            ...value,
            switchState: newSwitchState,
            travel: !newSwitchState ? undefined : value.travel,
        });
    };

    const onToggleCondition = (conditionId: Travel) => {
        if (value.switchState) onChange({ ...value, travel: conditionId });
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
                        checked={value.travel === item.id}
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
