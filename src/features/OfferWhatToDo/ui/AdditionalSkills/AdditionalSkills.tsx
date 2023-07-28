import { memo } from "react";

import styles from "./AdditionalSkills.module.scss";
import { successIcon } from "@/shared/data/icons";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";

interface Props {
    className?: string;
    value: string[];
    onChange: (value: string[]) => void;
}

export const AdditionalSkills = memo(({ className, onChange, value }: Props) => {
    const onSkillsChange = () => {};
    return (
        <div className={styles.wrapper}>
            <IconButtonComponent className={styles.icon} icon={successIcon} />
            <AddButton text="Добавить навык" />
        </div>
    );
});
