import cn from "classnames";
import React, { FC, useId, useState } from "react";

import { ReactSVG } from "react-svg";
import eye from "@/shared/assets/icons/eye.svg";
import eyeHide from "@/shared/assets/icons/eye-hide.svg";

import styles from "./AuthInputField.module.scss";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string;
    text?: string;
    error?: string;
}

const InputField: FC<InputFieldProps> = ({
    type,
    text,
    value,
    defaultValue,
    onChange,
    error,
    id,
    ...rest
}) => {
    const [showPassword, setShowPassword] = useState(false);
    // Раньше у всех полей был name="main" и label htmlFor="main" без такого id —
    // метка не была связана с полем
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;
    return (
        <div className={styles.box}>
            <div className={styles.wrapper}>
                <input
                    type={inputType}
                    required
                    onChange={onChange}
                    value={value}
                    defaultValue={defaultValue}
                    id={fieldId}
                    {...rest}
                />
                {type === "password" && (
                    <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPassword((prev) => !prev)}
                        title={showPassword ? "Показать пароль" : "Скрыть пароль"}
                    >
                        {showPassword ? (
                            <ReactSVG
                                src={eyeHide}
                                className={styles.eye}
                                fontSize={14}
                            />
                        ) : <ReactSVG src={eye} fontSize={14} className={styles.eye} />}
                    </button>
                )}
            </div>
            <label
                htmlFor={fieldId}
                className={cn({
                    [styles.empty]: value || defaultValue,
                })}
            >
                {text}
            </label>
            {error && (<ErrorText text={error} />)}
        </div>
    );
};

export default InputField;
