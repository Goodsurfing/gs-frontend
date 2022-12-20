import { IOption } from "@/type/select";
import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import SelectField from "@/components/SelectField/SelectField";

import {
    days,
    months,
    years,
} from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm.data";
import ProfileInfoFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoFormGroup/ProfileInfoFormGroup";

import styles from "./DateOfBirthFormGroup.module.scss";

interface DateOfBirthFormGroupProps {
    control: Control;
    isLocked: boolean;
}

const DateOfBirthFormGroup: FC<DateOfBirthFormGroupProps> = ({
    control,
    isLocked,
}) => {
    return (
        <ProfileInfoFormGroup
            title={"Дата рождения"}
            className={styles.dateOfBirth}
        >
            <Controller
                control={control}
                name={"dayOfBirth"}
                defaultValue={"1"}
                render={({ field: { onChange, value, name } }) => (
                    <SelectField
                        placeholder={""}
                        name={name}
                        options={days}
                        value={days.find((item) => item.value === value)}
                        onChange={(selectedOption) => {
                            onChange((selectedOption as IOption).value);
                        }}
                        isDisabled={isLocked}
                    />
                )}
            />
            <Controller
                control={control}
                name={"monthOfBirth"}
                defaultValue={"1"}
                render={({ field: { onChange, value, name } }) => (
                    <SelectField
                        placeholder={""}
                        name={name}
                        options={months}
                        value={months.find((item) => item.value === value)}
                        onChange={(selectedOption) => {
                            onChange((selectedOption as IOption).value);
                        }}
                        isDisabled={isLocked}
                    />
                )}
            />
            <Controller
                control={control}
                name={"yearOfBirth"}
                defaultValue={"1992"}
                render={({ field: { onChange, value, name } }) => (
                    <SelectField
                        placeholder={""}
                        name={name}
                        options={years}
                        value={years.find((item) => item.value === value)}
                        onChange={(selectedOption) => {
                            onChange((selectedOption as IOption).value);
                        }}
                        isDisabled={isLocked}
                    />
                )}
            />
        </ProfileInfoFormGroup>
    );
};

export default DateOfBirthFormGroup;
