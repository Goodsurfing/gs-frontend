import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";
import Input from "@/shared/ui/Input/Input";

import { IGeneralFormGroup, IUserInfoForm } from "../ProfileInfoForm.interface";
import styles from "./GeneralFormGroup.module.scss";

interface GeneralFormGroupProps {
    control: Control<IUserInfoForm>;
    isLocked: boolean;
    data: IGeneralFormGroup;
}

const GeneralFormGroup: FC<GeneralFormGroupProps> = ({
    data,
    control,
    isLocked,
}) => {
    return (
        <div className={styles.general}>
            <div className={styles.nameWrapper}>
                <div className={styles.name}>
                    <Controller
                        control={control}
                        name="firstName"
                        defaultValue={data.firstName}
                        render={({ field }) => {
                            return (
                                <Input
                                    onChange={(e) => { return field.onChange(e); }}
                                    value={field.value}
                                    label="Имя"
                                    id="firstName"
                                    required
                                    disabled={isLocked}
                                />
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name="lastName"
                        defaultValue={data.lastName}
                        render={({ field }) => {
                            return (
                                <Input
                                    onChange={(e) => { return field.onChange(e); }}
                                    value={field.value}
                                    label="Фамилия"
                                    required
                                    id="lastName"
                                    disabled={isLocked}
                                />
                            );
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default GeneralFormGroup;
