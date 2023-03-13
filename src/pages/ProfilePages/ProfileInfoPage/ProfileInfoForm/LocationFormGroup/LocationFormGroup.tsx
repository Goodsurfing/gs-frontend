import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import SelectField from "@/components/SelectField/SelectField";
import Dropdown from "@/components/ui/Dropdown/Dropdown";

import { days } from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm.data";

import { countries } from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm.data";

import { IOption } from "@/types/select";

import styles from "./LocationFormGroup.module.scss";

interface LocationFormGroupProps {
    control: any;
    isLocked: boolean;
}

const LocationFormGroup: FC<LocationFormGroupProps> = ({
    control,
    isLocked,
}) => {
    return (
        <div className={styles.location}>
            <div className={styles.address}>
                <Controller
                    control={control}
                    name="county"
                    defaultValue="Russia"
                    render={({ field: { onChange, value, name } }) => {
                        return (
                            <SelectField
                                options={countries}
                                name={name}
                                label="Страна"
                                placeholder="Страна"
                                value={countries.find((country) => country.value === value)}
                                onChange={(selectedOption) => {
                                    onChange((selectedOption as IOption).value)
                                }}
                                required
                            />
                        );
                    }}
                />
                <Controller
                    control={control}
                    name="city"
                    defaultValue="1"
                    render={({ field: { onChange, value, name } }) => {
                        return (
                            <SelectField
                                label="Город"
                                name={name}
                                placeholder="Казань"
                                options={days}
                                value={days.find((city) => city.value === value)}
                                onChange={(selectedOption) => {
                                    onChange((selectedOption as IOption).value);
                                }}
                                isDisabled={isLocked}
                            />
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default LocationFormGroup;
