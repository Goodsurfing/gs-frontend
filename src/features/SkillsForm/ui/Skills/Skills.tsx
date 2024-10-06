import { memo, useCallback } from "react";

import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";
import { useSkillsData } from "@/shared/data/skills";

import styles from "./Skills.module.scss";
import { WhatToDoSkillType } from "@/types/skills";

interface Props {
    className?: string;
    value: WhatToDoSkillType[];
    onChange: (value: WhatToDoSkillType[]) => void;
}

export const Skills = memo(({ className, onChange, value }: Props) => {
    const { skillsData } = useSkillsData();
    const handleIconStateChange = useCallback((id: WhatToDoSkillType) => {
        const isActive = value.find((item) => item === id);
        if (isActive) {
            onChange(value.filter((skill) => skill !== id));
        } else if ((value?.length || 0) <= 10) {
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
