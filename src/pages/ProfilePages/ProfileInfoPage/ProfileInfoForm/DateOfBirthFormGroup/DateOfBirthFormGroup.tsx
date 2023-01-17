import i18n from "@/i18n";
import React, { FC, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Control, Controller } from "react-hook-form";

import DatePicker from "@/components/DatePicker/DatePicker";
import InputField from "@/components/InputField/InputField";
import SelectField from "@/components/SelectField/SelectField";

import {
    days,
    months,
    years,
} from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm.data";
import ProfileInfoFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoFormGroup/ProfileInfoFormGroup";

import { IOption } from "@/types/select";

import {
    IDateOfBirthFormGroup,
    IUserInfoForm,
} from "../ProfileInfoForm.interface";
import styles from "./DateOfBirthFormGroup.module.scss";

interface DateOfBirthFormGroupProps {
    control: Control<IUserInfoForm>;
    isLocked: boolean;
    data: IDateOfBirthFormGroup;
}

const DateOfBirthFormGroup: FC<DateOfBirthFormGroupProps> = ({
    control,
    isLocked,
    data,
}) => {
    return (
        <ProfileInfoFormGroup
            title="Дата рождения"
            className={styles.dateOfBirth}
        >
            <Controller
                control={control}
                name="birthDate"
                render={({ field }) => {
                    return (
                        <DatePicker
                            data={data}
                            isLocked={isLocked}
                            value={field.value}
                            onChange={field.onChange}
                            CustomInputElement={<input type="text" />}
                        />
                    );
                }}
            />
        </ProfileInfoFormGroup>
    );
};

export default DateOfBirthFormGroup;
