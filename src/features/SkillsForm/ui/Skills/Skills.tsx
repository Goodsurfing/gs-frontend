import { memo, useCallback } from "react";

import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";
import { useSkillsData } from "@/shared/data/skills";

import { Skill } from "@/types/skills";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./Skills.module.scss";

interface Props {
    skills: Skill[];
    className?: string;
    value?: Skill[];
    onChange: (value: Skill[]) => void;
}

export const Skills = memo(({
    className, onChange, value = [], skills,
}: Props) => {
    const { getTranslation } = useSkillsData();

    const handleIconStateChange = useCallback((skill: Skill) => {
        const isActive = value.find((item) => item.id === skill.id);
        if (isActive) {
            onChange(value.filter((item) => item.id !== skill.id));
        } else if ((value?.length || 0) <= 10) {
            onChange([...value, skill]);
        }
    }, [onChange, value]);

    if (!skills) {
        return null;
    }

    return (
        <div className={className}>
            {skills.map((skill) => (
                <IconButtonComponent
                    className={styles.icon}
                    activeClassName={styles.active}
                    key={skill.id}
                    size="large"
                    text={getTranslation(skill.name)}
                    icon={getMediaContent(skill.imagePath) ?? ""}
                    checked={!!value.find((item) => item.id === skill.id)}
                    onClick={() => handleIconStateChange(skill)}
                />
            ))}
        </div>
    );
});
