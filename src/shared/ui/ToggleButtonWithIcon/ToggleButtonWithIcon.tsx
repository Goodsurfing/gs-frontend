import cn from "classnames";

import IconComponent from "@/shared/ui/IconComponent/IconComponent";

import styles from "./ToggleButtonWithIcon.module.scss";

interface ToggleButtonProps {
    onToggle?: () => void;
    checked?: boolean;
    className?: string;
    iconClassName?: string;
    activeIconClassName?: string;
    text: string;
    icon: string;
    alt?: string;
}

export const ToggleButtonWithIcon = ({
    checked,
    text,
    icon,
    iconClassName,
    activeIconClassName,
    alt,
    onToggle,
    className,
}: ToggleButtonProps) => (
    <button onClick={onToggle} type="button" className={cn(styles.button, className)}>
        <IconComponent
            className={cn(iconClassName, {
                [cn(styles.iconActive, activeIconClassName)]: checked,
            })}
            icon={icon}
            alt={alt}
        />
        {text}
    </button>
);
