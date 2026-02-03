import { memo, useCallback } from "react";

import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";

import { Skill } from "@/types/skills";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./Skills.module.scss";

interface Props {
    skills: Skill[];
    className?: string;
    value?: number[];
    onChange: (value: number[]) => void;
}

export const Skills = memo(({
    className, onChange, value = [], skills,
}: Props) => {
    const handleIconStateChange = useCallback((skill: Skill) => {
        const isActive = value.find((item) => item === skill.id);
        if (isActive) {
            onChange(value.filter((item) => item !== skill.id));
        } else if ((value.length || 0) <= 10) {
            onChange([...value, skill.id]);
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
                    text={skill.name}
                    icon={getMediaContent(skill.imagePath) ?? ""}
                    checked={!!value.find((item) => item === skill.id)}
                    onClick={() => handleIconStateChange(skill)}
                />
            ))}
        </div>
    );
});
