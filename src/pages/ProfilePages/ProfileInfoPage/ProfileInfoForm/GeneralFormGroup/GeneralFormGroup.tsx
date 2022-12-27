import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import FileUpload from "@/components/FileUpload/FileUpload";
import InputField from "@/components/InputField/InputField";

import styles from "./GeneralFormGroup.module.scss";
import { IUserInfo } from "../ProfileInfoForm.interface";

interface IFields {
    firstName: string | null;
    lastName: string | null;
}

interface GeneralFormGroupProps {
    control: Control<IUserInfo>;
    isLocked: boolean;
    data: IFields;
}

const GeneralFormGroup: FC<GeneralFormGroupProps> = ({ data, control, isLocked }) => {
    return (
        <div className={styles.general}>
            <div className={styles.name}>
                <Controller
                    control={control}
                    name="firstName"
                    defaultValue={data.firstName!}
                    render={({ field }) => {
                        return (
                            <InputField
                                onChange={(e) => {
                                    return field.onChange(e);
                                }}
                                value={field.value}
                                text="Имя"
                                type="text"
                                disabled={isLocked}
                            />
                        );
                    }}
                />
                <Controller
                    control={control}
                    name="lastName"
                    defaultValue={data.lastName!}
                    render={({ field }) => {
                        return (
                            <InputField
                                onChange={(e) => {
                                    return field.onChange(e);
                                }}
                                value={field.value}
                                text="Фамилия"
                                type="text"
                                disabled={isLocked}
                            />
                        );
                    }}
                />
            </div>
            <div className={styles.avatar}>
                <FileUpload />
            </div>
        </div>
    );
};

export default GeneralFormGroup;
