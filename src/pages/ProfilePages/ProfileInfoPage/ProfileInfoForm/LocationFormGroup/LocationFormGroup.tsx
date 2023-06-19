import React, { FC, useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';

import SelectField from 'components/SelectField/SelectField';

import {
  cities,
  countries,
  preparedLanguageData,
} from 'pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm.data';

import { IOption } from 'types/select';

import styles from './LocationFormGroup.module.scss';

interface LocationFormGroupProps {
    control: any;
    isLocked: boolean;
}

const LocationFormGroup: FC<LocationFormGroupProps> = ({
  control,
  isLocked,
}) => (
    <div className={styles.location}>
        <div className={styles.address}>
            <Controller
                control={control}
                name="country"
                defaultValue="Russia"
                render={({ field: { onChange, value, name } }) => (
                    <SelectField
                        isDisabled={isLocked}
                        options={countries}
                        name={name}
                        label="Страна"
                        placeholder="Страна"
                        value={countries.find(
                          (country) => country.value === value,
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
                defaultValue={preparedLanguageData}
                render={({ field: { onChange, value, name } }) => (
                    <SelectField
                        isDisabled={isLocked}
                        label="Язык"
                        name={name}
                        placeholder="Русский"
                        defaultValue={preparedLanguageData}
                        options={preparedLanguageData}
                        value={preparedLanguageData.find((language) => language.value === value)}
                        onChange={(selectedOption) => {
                          onChange((selectedOption as IOption));
                        }}
                        required
                    />
                )}
            />
        </div>
    </div>
);

export default LocationFormGroup;
