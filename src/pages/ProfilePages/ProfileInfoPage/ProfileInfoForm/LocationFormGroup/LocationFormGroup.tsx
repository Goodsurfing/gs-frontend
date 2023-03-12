import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import SelectField from "@/components/SelectField/SelectField";

import { days } from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm.data";

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
                    defaultValue="1"
                    render={({ field: { onChange, value, name } }) => {
                        return (
                            <SelectField
                                text="Страна"
                                placeholder="Россия"
                                name={name}
                                options={days}
                                value={days.find((item) => {
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
                <Controller
                    control={control}
                    name="city"
                    defaultValue="1"
                    render={({ field: { onChange, value, name } }) => {
                        return (
                            <SelectField
                                text="Город"
                                placeholder="Казань"
                                name={name}
                                options={days}
                                value={days.find((item) => {
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
            </div>
            <div className={styles.language}>
                <Controller
                    control={control}
                    name="language"
                    defaultValue="1"
                    render={({ field: { onChange, value, name } }) => {
                        return (
                            <SelectField
                                text="Язык интерфейса"
                                placeholder="RU"
                                name={name}
                                options={days}
                                value={days.find((item) => {
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
            </div>
        </div>
    );
};

export default LocationFormGroup;
