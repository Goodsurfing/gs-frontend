import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import ImageUpload from "@/components/ImageUpload/ImageUpload";
import InputField from "@/components/InputField/InputField";

import { IGeneralFormGroup, IUserInfo } from "../ProfileInfoForm.interface";
import styles from "./GeneralFormGroup.module.scss";

interface GeneralFormGroupProps {
    control: Control<IUserInfo>;
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
                <ImageUpload
                    id="profilePicture"
                    disabled={isLocked}
                    name="profilePicture"
                    defaultImage={data.image}
                />
            </div>
        </div>
    );
};

export default GeneralFormGroup;
