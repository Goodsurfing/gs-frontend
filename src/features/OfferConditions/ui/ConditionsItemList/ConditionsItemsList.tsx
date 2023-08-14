import { memo } from "react";
import cn from "classnames";

import { ConditionsItem } from "../ConditionsItem/ConditionsItem";

import { ConditionItems, ConditionIds } from "../../model/types/conditionsData";

import styles from "./ConditionsItemsList.module.scss";

interface ConditionsItemsListProps<T extends ConditionIds> {
    className?: string;
    items: ConditionItems[];
    value: PartOfIds<T>[];
    onChange: (value: PartOfIds<T>[]) => void;
}

export const ConditionsItemsList = memo((props: ConditionsItemsListProps<ConditionIds>) => {
    const {
        className,
        items,
        value,
        onChange,
    } = props;

    const onToggleCondition = (id: ConditionIds) => {
        const activeIndex = value.findIndex((item) => item === id);
        if (activeIndex !== -1) {
            onChange([...value.filter((val) => val !== id)]);
        } else {
            onChange([...value, id]);
        }
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            {items.map((condition) => (
                <ConditionsItem
                    checked={!!value.find((val) => val === condition.id)}
                    onToggle={() => onToggleCondition(condition.id)}
                    icon={condition.icon}
                    text={condition.text}
                    key={condition.id}
                />
            ))}
        </div>
    );
});
