import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import ProfileInfoFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoFormGroup/ProfileInfoFormGroup";

import styles from "./GenderFormGroup.module.scss";
import SelectField from "@/components/SelectField/SelectField";
import { IOption } from "@/types/select";
import { genderOptions } from "./GenderFormGroup.data";

interface GenderFormGroupProps {
    control: Control;
    isLocked: boolean;
}

const GenderFormGroup: FC<GenderFormGroupProps> = ({ control, isLocked }) => {
    return (
        <ProfileInfoFormGroup title="Пол" className={styles.gender}>
            <Controller
                control={control}
                name="yearOfBirth"
                defaultValue="1992"
                render={({ field: { onChange, value, name } }) => {
                    return (
                        <SelectField
                            placeholder=""
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
