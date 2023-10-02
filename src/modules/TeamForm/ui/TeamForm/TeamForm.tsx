import React from "react";

import { Controller, useForm } from "react-hook-form";
import Button from "@/shared/ui/Button/Button";

import { Text } from "../Text/Text";

import styles from "./TeamForm.module.scss";
import { TeamInput } from "../TeamInput/TeamInput";

export const TeamForm = () => {
    const { control } = useForm({ mode: "onChange" });
    return (
        <div className={styles.wrapper}>
            <Text />
            <Controller
                control={control}
                name="team"
                render={({ field }) => {
                    console.log(field.value);
                    return (
                        <TeamInput inputValue={field.value} onInputChange={field.onChange} />
                    );
                }}
            />
            <Button
                className={styles.btn}
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
            >
                Сохранить
            </Button>
        </div>
    );
};
