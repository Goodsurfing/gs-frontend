import { memo, InputHTMLAttributes } from "react";
import cn from "classnames";

import styles from "./InputWithIcon.module.scss";
import IconComponent from "../IconComponent/IconComponent";

interface InputButtonProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    inputClassName?: string;
    iconClassName?: string;
    placeholder?: string;
    icon?: string;
}

export const InputButton = memo((props: InputButtonProps) => {
    const {
        className,
        placeholder,
        inputClassName,
        iconClassName,
        value,
        onChange,
        icon,
        ...restInputProps
    } = props;
    return (
        <div className={cn(styles.wrapper, className)}>
            <input
                onChange={onChange}
                value={value}
                placeholder={placeholder}
                className={cn(inputClassName, styles.input)}
                type="text"
                {...restInputProps}
            />
            {icon && (
                <IconComponent
                    className={cn(iconClassName, styles.icon)}
                    icon={icon}
                    alt="add"
                />
            )}
        </div>
    );
});
