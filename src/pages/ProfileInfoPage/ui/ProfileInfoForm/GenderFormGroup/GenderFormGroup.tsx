import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import SelectField from "@/components/SelectField/SelectField";

import ProfileInfoFormGroup from "../ProfileInfoFormGroup/ProfileInfoFormGroup";

import { IOption } from "@/types/select";

import { IGenderFormGroup, IUserInfoForm } from "../ProfileInfoForm.interface";
import { genderOptions } from "./GenderFormGroup.data";
import styles from "./GenderFormGroup.module.scss";

interface GenderFormGroupProps {
    control: Control<IUserInfoForm>;
    isLocked: boolean;
    data: IGenderFormGroup;
}

const GenderFormGroup: FC<GenderFormGroupProps> = ({
    data,
    control,
    isLocked,
}) => {
    return (
        <ProfileInfoFormGroup className={styles.gender}>
            <Controller
                control={control}
                name="gender"
                defaultValue={data.gender}
                render={({ field: { onChange, value, name } }) => {
                    return (
                        <SelectField
                            label="Пол"
                            placeholder="Укажите ваш пол"
                            name={name}
                            options={genderOptions}
                            value={genderOptions.find((item) => {
                                return item.value === value;
                            })}
                            onChange={(selectedOption) => {
                                onChange((selectedOption as IOption).value);
                            }}
                            isDisabled={isLocked}
                        />
                    );
                }}
            />
        </ProfileInfoFormGroup>
    );
};

export default GenderFormGroup;
