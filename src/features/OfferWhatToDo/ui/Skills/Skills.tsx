import cn from "classnames";
import { memo, useCallback } from "react";

import styles from "./Skills.module.scss";
import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";
import { skillsData } from "@/shared/data/skills";
import { OfferWhatToDoSkillType } from "@/entities/Offer";

interface Props {
    className?: string;
    value: OfferWhatToDoSkillType[];
    onChange: (value: OfferWhatToDoSkillType[]) => void;
}

export const Skills = memo(({ className, onChange, value }: Props) => {
    const handleIconStateChange = useCallback((id: OfferWhatToDoSkillType) => {
        const isActive = value.find((item) => item === id);
        if (isActive) {
            onChange(value.filter((skill) => skill !== id));
        } else {
            onChange([...value, id]);
        }
    }, [onChange, value]);
    return (
        <div className={cn(styles.wrapper, className)}>
            {skillsData.map((skill) => (
                <IconButtonComponent
                    key={skill.id}
                    className={styles.icon}
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
