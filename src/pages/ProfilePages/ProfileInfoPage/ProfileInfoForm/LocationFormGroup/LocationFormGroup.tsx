import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import SelectField from "@/components/SelectField/SelectField";

import {
    cities,
    countries,
    languages,
} from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm.data";

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
                    render={({ field: { onChange, value, name } }) => (
                        <SelectField
                            isDisabled={isLocked}
                            options={countries}
                            name={name}
                            label="Страна"
                            placeholder="Страна"
                            value={countries.find(
                                (country) => country.value === value
                            )}
                            onChange={(selectedOption) => {
                                onChange((selectedOption as IOption).value);
                            }}
                            required
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="city"
                    defaultValue="Kazan"
                    render={({ field: { onChange, value, name } }) => (
                        <SelectField
                            isDisabled={isLocked}
                            label="Город"
                            name={name}
                            placeholder="Казань"
                            options={cities}
                            value={cities.find((city) => city.value === value)}
                            onChange={(selectedOption) => {
                                onChange((selectedOption as IOption).value);
                            }}
                            required
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="language"
                    defaultValue="Русский"
                    render={({ field: { onChange, value, name } }) => (
                        <SelectField
                            isDisabled={isLocked}
                            label="Город"
                            name={name}
                            placeholder="Русский"
                            options={languages}
                            value={languages.find((language) => language.value === value)}
                            onChange={(selectedOption) => {
                                onChange((selectedOption as IOption).value);
                            }}
                            required
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default LocationFormGroup;
