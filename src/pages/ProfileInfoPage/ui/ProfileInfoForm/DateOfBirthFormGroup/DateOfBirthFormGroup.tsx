import Input from "@/shared/ui/Input/Input";
import React, { FC } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Control, Controller } from "react-hook-form";

import DatePicker from "@/components/DatePicker/DatePicker";

import ProfileInfoFormGroup from "../ProfileInfoFormGroup/ProfileInfoFormGroup";

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
        <ProfileInfoFormGroup className={styles.dateOfBirth}>
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
                            CustomInputElement={(
                                <Input
                                    required
                                    label="Дата рождения"
                                    id="birthdate"
                                />
                            )}
                        />
                    );
                }}
            />
        </ProfileInfoFormGroup>
    );
};

export default DateOfBirthFormGroup;
