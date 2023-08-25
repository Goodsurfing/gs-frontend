import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import cn from "classnames";
import { MenuItem } from "@mui/material";

import { SelectComponent } from "@/shared/ui/Select/Select";
import { useAppSelector } from "@/shared/hooks/redux";

import { getProfileReadonly } from "@/entities/Profile";

import styles from "./ProfileInfoFormGender.module.scss";

interface ProfileInfoFormGenderProps {
    className?: string;
}

export const ProfileInfoFormGender = memo((props: ProfileInfoFormGenderProps) => {
    const { className } = props;

    const isLocked = useAppSelector(getProfileReadonly);

    const { control } = useFormContext();

    return (
        <div className={cn(className, styles.wrapper)}>
            <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                    <SelectComponent
                        value={field.value}
                        label="Пол"
                        disabled={isLocked}
                        className={styles.genderDropdown}
                    >
                        <MenuItem key="male" value="male">Мужчина</MenuItem>
                        <MenuItem key="female" value="female">Женщина</MenuItem>
                        <MenuItem key="other" value="other">Другой</MenuItem>
                    </SelectComponent>
                )}
            />
        </div>
    );
});
