import cn from "classnames";
import {
    KeyboardEvent,
    MouseEvent,
    memo,
    useRef,
} from "react";
import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";
import { InputButton } from "@/shared/ui/InputWithIcon/InputWithIcon";

import styles from "./InputWithButton.module.scss";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

export interface InputWithButtonProps {
    value: string;
    onClick?: (e: MouseEvent<HTMLInputElement>) => void;
    onButtonClick?: () => void;
    onChange?: (value: string) => void;
    onSubmit: (value: string) => void;
    disabled?: boolean;
    checked?: boolean;
    buttonIcon: string;
    inputButtonIcon?: string;
    activeClassName?: string;
    placeholder?: string;
    className?: string;
    iconButtonClassName?: string;
    inputClassName?: string;
    inputButtonClassName?: string;
}

export const InputWithButton = memo((props: InputWithButtonProps) => {
    const {
        value,
        onChange,
        onButtonClick,
        disabled,
        activeClassName,
        onClick,
        onSubmit,
        buttonIcon,
        inputButtonIcon,
        iconButtonClassName,
        inputClassName,
        inputButtonClassName,
        placeholder,
        className,
        checked,
    } = props;

    const divRef = useRef(null);

    const onSubmitInputValue = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "Escape") {
            onSubmit(value);
        }
    };

    const onButtonSubmit = () => {
        onSubmit(value);
        onButtonClick?.();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    };

    useOnClickOutside(divRef, () => {
        if (value) {
            onSubmit(value);
        }
    });

    return (
        <div ref={divRef} className={cn(styles.wrapper, className)}>
            <div className={styles.btn} onClick={onButtonSubmit}>
                <IconButtonComponent
                    disabled={disabled || !value}
                    className={cn(styles.iconButton, iconButtonClassName)}
                    activeClassName={activeClassName}
                    checked={checked}
                    icon={buttonIcon}
                />
            </div>
            <div onClick={onClick}>
                <InputButton
                    value={value}
                    disabled={disabled}
                    inputClassName={inputClassName}
                    onKeyDown={onSubmitInputValue}
                    onChange={onInputChange}
                    iconClassName={cn(styles.inputIcon, inputButtonClassName)}
                    placeholder={placeholder}
                    icon={inputButtonIcon}
                />
            </div>
        </div>
    );
});
