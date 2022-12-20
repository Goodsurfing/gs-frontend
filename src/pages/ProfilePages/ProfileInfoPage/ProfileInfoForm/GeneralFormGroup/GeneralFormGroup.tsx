import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import FileUpload from "@/components/FileUpload/FileUpload";
import InputField from "@/components/InputField/InputField";

import styles from "./GeneralFormGroup.module.scss";

interface GeneralFormGroupProps {
    control: Control;
    isLocked: boolean;
}

const GeneralFormGroup: FC<GeneralFormGroupProps> = ({ control, isLocked }) => {
    return (
        <div className={styles.general}>
            <div className={styles.name}>
                <Controller
                    control={control}
                    name={"name"}
                    defaultValue={"Владислав"}
                    render={({ field }) => (
                        <InputField
                            onChange={(e) => field.onChange(e)}
                            value={field.value}
                            text={"Имя"}
                            type={"text"}
                            disabled={isLocked}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name={"surname"}
                    defaultValue={"Александров"}
                    render={({ field }) => (
                        <InputField
                            onChange={(e) => field.onChange(e)}
                            value={field.value}
                            text={"Фамилия"}
                            type={"text"}
                            disabled={isLocked}
                        />
                    )}
                />
            </div>
            <div className={styles.avatar}>
                <FileUpload />
            </div>
        </div>
    );
};

export default GeneralFormGroup;
