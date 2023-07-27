import cn from "classnames";
import { memo, useCallback } from "react";

import styles from "./Skills.module.scss";
import { skillsData } from "@/shared/data/skills";
import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";

interface Props {
    className?: string;
    value: any;
    onChange: any;
}

export const Skills = memo(({ className }: Props) => {
    const handleStatusChange = useCallback(() => {

    }, []);
    return (
        <div className={cn(styles.wrapper, className)}>
            {skillsData.map((item, i) => (
                <IconButtonComponent
                    key={i}
                    className={styles.icon}
                    text={item.text}
                    size="large"
                    onClick={onIconClick}
                    checked={checked}
                    icon={item.icon}
                />
            ))}
        </div>
    );
});
