import cn from "classnames";
import { memo, useState } from "react";
import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";
import { InputButton } from "@/shared/ui/InputWithIcon/InputWithIcon";

import styles from "./InputWithButton.module.scss";

interface Props {
    onSubmit: (value: string) => void;
    icon: string;
    inputButtonIcon: string;
    placeholder?: string;
    className?: string;
    iconButtonClassName?: string;
    inputButtonClassName?: string;
}

export const InputWithButton = memo((props: Props) => {
    const {
        onSubmit,
        icon,
        inputButtonIcon,
        iconButtonClassName,
        inputButtonClassName,
        placeholder,
        className,
    } = props;
    const [value, setValue] = useState("");

    const onSubmitInputValue = () => {
        onSubmit(value);
        setValue("");
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <IconButtonComponent
                disabled={!value}
                className={cn(styles.iconButton, iconButtonClassName)}
                onClick={onSubmitInputValue}
                checked={false}
                icon={icon}
            />
            <InputButton
                value={value}
                onChange={onInputChange}
                iconClassName={cn(styles.inputIcon, inputButtonClassName)}
                placeholder={placeholder}
                icon={inputButtonIcon}
            />
        </div>
    );
});
