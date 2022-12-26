import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import ToggleSwitch from "@/components/ToggleSwitch/ToggleSwitch";

import ProfileInfoFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoFormGroup/ProfileInfoFormGroup";

import styles from "./GenderFormGroup.module.scss";

interface GenderFormGroupProps {
    control: Control;
    isLocked: boolean;
}

const GenderFormGroup: FC<GenderFormGroupProps> = ({ control, isLocked }) => {
    return (
        <ProfileInfoFormGroup title="Пол" className={styles.gender}>
            <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, name } }) => {
                    return (
                        <ToggleSwitch
                            disabled={isLocked}
                            label="Мужчина"
                            name={name}
                            value="male"
                            onChange={(e) => {
                                return onChange(e);
                            }}
                        />
                    );
                }}
            />
            <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, name } }) => {
                    return (
                        <ToggleSwitch
                            disabled={isLocked}
                            label="Женщина"
                            name={name}
                            value="female"
                            onChange={(e) => {
                                return onChange(e);
                            }}
                        />
                    );
                }}
            />
            <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, name } }) => {
                    return (
                        <ToggleSwitch
                            disabled={isLocked}
                            label="Другой"
                            name={name}
                            value="other"
                            onChange={(e) => {
                                return onChange(e);
                            }}
                        />
                    );
                }}
            />
        </ProfileInfoFormGroup>
    );
};

export default GenderFormGroup;
