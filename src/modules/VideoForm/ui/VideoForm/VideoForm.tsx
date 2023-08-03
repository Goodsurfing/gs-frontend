import React from "react";

import { Controller, useForm } from "react-hook-form";
import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";
import { Text } from "../Text/Text";
import { VideoInput } from "../VideoInput/VideoInput";

import styles from "./VideoForm.module.scss";

export const VideoForm = () => {
    const { control } = useForm({ mode: "onChange" });
    return (
        <div className={styles.wrapper}>
            <Text />
            <Controller
                control={control}
                name="video"
                render={({ field }) => {
                    console.log(field.value);
                    return (
                        <VideoInput inputValue={field.value} onInputChange={field.onChange} />
                    );
                }}
            />
            <Button className={styles.btn} variant={Variant.PRIMARY}>
                Сохранить
            </Button>
        </div>
    );
};
