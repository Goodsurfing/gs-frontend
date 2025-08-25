import cn from "classnames";
import React, { FC, useState } from "react";

import { ReactSVG } from "react-svg";
import eye from "@/shared/assets/icons/eye.svg";
import eyeHide from "@/shared/assets/icons/eye-hide.svg";

import styles from "./InputField.module.scss";
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
    ...rest
}) => {
    const [showPassword, setShowPassword] = useState(false);
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
                    name="main"
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
                htmlFor="main"
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
