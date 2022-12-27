import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import ProfileInfoFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoFormGroup/ProfileInfoFormGroup";

import styles from "./GenderFormGroup.module.scss";
import SelectField from "@/components/SelectField/SelectField";
import { IOption } from "@/types/select";
import { genderOptions } from "./GenderFormGroup.data";
import { IGenderFormGroup, IUserInfo } from "../ProfileInfoForm.interface";

interface GenderFormGroupProps {
    control: Control<IUserInfo>;
    isLocked: boolean;
    data: IGenderFormGroup;
}

const GenderFormGroup: FC<GenderFormGroupProps> = ({ data, control, isLocked }) => {
    return (
        <ProfileInfoFormGroup title="Пол" className={styles.gender}>
            <Controller
                control={control}
                name="gender"
                defaultValue={data.gender}
                render={({ field: { onChange, value, name } }) => {
                    return (
                        <SelectField
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
