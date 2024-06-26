import { memo, useCallback } from "react";

import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";
import { useSkillsData } from "@/shared/data/skills";
import { OfferWhatToDoSkillType } from "@/entities/Offer";

import styles from "./Skills.module.scss";

interface Props {
    className?: string;
    value: OfferWhatToDoSkillType[];
    onChange: (value: OfferWhatToDoSkillType[]) => void;
}

export const Skills = memo(({ className, onChange, value }: Props) => {
    const { skillsData } = useSkillsData();
    const handleIconStateChange = useCallback((id: OfferWhatToDoSkillType) => {
        const isActive = value.find((item) => item === id);
        if (isActive) {
            onChange(value.filter((skill) => skill !== id));
        } else {
            onChange([...value, id]);
        }
    }, [onChange, value]);
    return (
        <div className={className}>
            {skillsData.map((skill) => (
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
