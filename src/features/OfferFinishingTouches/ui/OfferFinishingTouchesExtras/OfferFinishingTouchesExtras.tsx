import { memo, useCallback } from "react";

import { ExtraConditions } from "@/entities/Offer";

import styles from "./OfferFinishingTouchesExtras.module.scss";
import { useExtraConditionsData } from "../../model/data/extraConditionsData";
import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";

interface OfferFinishingTouchesExtrasProps {
    className?: string;
    value: ExtraConditions[];
    onChange: (value: ExtraConditions[]) => void;
}

export const OfferFinishingTouchesExtras = memo((props: OfferFinishingTouchesExtrasProps) => {
    const { className, onChange, value } = props;
    const { extraConditionsData } = useExtraConditionsData();
    const handleIconStateChange = useCallback((id: ExtraConditions) => {
        const isActive = value.find((item) => item === id);
        if (isActive) {
            onChange(value.filter((skill) => skill !== id));
        } else {
            onChange([...value, id]);
        }
    }, [onChange, value]);
    return (
        <div className={className}>
            {extraConditionsData.map((skill) => (
                <IconButtonComponent
                    className={styles.icon}
                    activeClassName={styles.active}
                    key={skill.id}
                    size="large"
                    text={skill.text}
                    icon={skill.icon}
                    checked={!!value.find((item) => item === skill.id)}
                    onClick={() => handleIconStateChange(skill.id)}
                />
            ))}
        </div>
    );
});
