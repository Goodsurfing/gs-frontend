import { memo, useCallback } from "react";

import { useTranslation } from "react-i18next";
import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";
import { skillsData } from "@/shared/data/skills";
import { OfferWhatToDoSkillType } from "@/entities/Offer";

import styles from "./Skills.module.scss";

interface Props {
    className?: string;
    value: OfferWhatToDoSkillType[];
    onChange: (value: OfferWhatToDoSkillType[]) => void;
}

export const Skills = memo(({ className, onChange, value }: Props) => {
    const { t } = useTranslation();
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
                    text={t(`skills.${skill.id}`)}
                    icon={skill.icon}
                    checked={!!value.find((item) => item === skill.id)}
                    onClick={() => handleIconStateChange(skill.id)}
                />
            ))}
        </div>
    );
});
