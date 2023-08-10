import cn from "classnames";

import IconComponent from "@/shared/ui/IconComponent/IconComponent";

import styles from "./ToggleButtonWithIcon.module.scss";

interface ToggleButtonProps {
    onToggle?: () => void;
    checked?: boolean;
    className?: string;
    activeClassName?: string;
    text: string;
    icon: string;
    alt?: string;
}

export const ToggleButtonWithIcon = ({
    checked,
    text,
    icon,
    activeClassName,
    alt,
    onToggle,
    className,
}: ToggleButtonProps) => (
    <button
        onClick={onToggle}
        type="button"
        className={cn(styles.button, className, {
            [activeClassName || ""]: checked,
        })}
    >
        <IconComponent
            className={cn({
                [styles.iconActive]: checked,
            })}
            icon={icon}
            alt={alt}
        />
        {text}
    </button>
);
