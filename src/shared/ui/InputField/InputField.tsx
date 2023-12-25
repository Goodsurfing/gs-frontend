import React, { FC, memo } from "react";
import { TextField, TextFieldProps } from "@mui/material";

type InputFieldProps = TextFieldProps & {
    register: any;
    name: string;
    className?: string;
};

export const InputField: FC<InputFieldProps> = memo((props: InputFieldProps) => {
    const {
        className, name, register, ...otherProps
    } = props;
    return (
        <TextField
            {...register(name)}
            {...otherProps}
            className={className}
            sx={{
                "& .MuiOutlinedInput-root": {
                    height: "44px",
                    borderRadius: "10px",
                    borderColor: "var(--text-caption)",
                    "&:hover fieldset": {
                        borderColor: "var(--text-primary-1)",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "var(--text-primary-1)",
                    },
                },
            }}
        />
    );
});
