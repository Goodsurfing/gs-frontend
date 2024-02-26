import { memo } from "react";
import cn from "classnames";

import { ConditionsItem } from "../ConditionsItem/ConditionsItem";

import { ConditionItems } from "../../model/types/conditionsData";

import styles from "./ConditionsItemsList.module.scss";

interface ConditionsItemsListProps {
    className?: string;
    items: ConditionItems[];
    value: any; // Todo: types issue.
    onChange: (value: any) => void;
}

export const ConditionsItemsList = memo((props: ConditionsItemsListProps) => {
    const {
        className,
        items,
        value,
        onChange,
    } = props;

    const onToggleCondition = (id: string) => {
        onChange(id);
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            {items.map((condition) => (
                <ConditionsItem
                    checked={value === condition.id}
                    onToggle={() => onToggleCondition(condition.id)}
                    icon={condition.icon}
                    text={condition.text}
                    key={condition.id}
                />
            ))}
        </div>
    );
});
