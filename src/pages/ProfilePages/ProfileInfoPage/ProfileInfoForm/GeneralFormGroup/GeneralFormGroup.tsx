import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import ImageUpload from "@/components/ImageUpload/ImageUpload";
import InputField from "@/components/InputField/InputField";
import Input from "@/components/ui/Input/Input";

import { IGeneralFormGroup, IUserInfoForm } from "../ProfileInfoForm.interface";
import styles from "./GeneralFormGroup.module.scss";
import ProfileInput from "@/components/ProfileInput/ProfileInput";

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
            <div className={styles.name}>
                <Controller
                    control={control}
                    name="firstName"
                    defaultValue={data.firstName!}
                    render={({ field }) => {
                        return (
                            <Input
                                onChange={(e) => field.onChange(e)}
                                value={field.value}
                                label="Имя"
                                id="firstname"
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
                            <Input
                                onChange={(e) => field.onChange(e)}
                                value={field.value}
                                label="Фамилия"
                                id="lastname"
                                disabled={isLocked}
                            />
                        );
                    }}
                />
            </div>
            <div className={styles.avatar}>
                <ProfileInput route="/" />
                {/* <Controller
                    control={control}
                    name="image"
                    defaultValue={[]}
                    render={({ field }) => {
                        return (
                            <ImageUpload
                                onChange={(e) => {
                                    return field.onChange(e.target.files);
                                }}
                                value={field.value.filename}
                                id="profilePicture"
                                disabled={isLocked}
                                name="profilePicture"
                                defaultImage={data.image}
                            />
                        );
                    }}
                /> */}
            </div>
        </div>
    );
};

export default GeneralFormGroup;
