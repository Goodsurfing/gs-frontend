import { memo } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";
import { MenuItem } from "@mui/material";

import { useAppSelector } from "@/shared/hooks/redux";
import { SelectComponent } from "@/shared/ui/Select/Select";

import { getProfileReadonly } from "@/entities/Profile";

import { birthDateData, birthMounthData } from "../../model/data/birthData";

import styles from "./ProfileInfoFormBirthDate.module.scss";
import { InputControl } from "@/shared/ui/InputControl/InputControl";

interface ProfileInfoFormBirthDateProps {
    className?: string;
}

export const ProfileInfoFormBirthDate = memo((props: ProfileInfoFormBirthDateProps) => {
    const { className } = props;
    const isLocked = useAppSelector(getProfileReadonly);
    const { control } = useFormContext();
    const { t } = useTranslation("profile");
    return (
        <div className={cn(className, styles.wrapper)}>
            <span className={styles.text}>{t("info.День рождения")}</span>
            <div className={styles.container}>
                <Controller
                    name="birthDate.day"
                    control={control}
                    render={({ field }) => (
                        <SelectComponent
                            className={styles.dayDropdown}
                            disabled={isLocked}
                            value={field.value}
                        >
                            {birthDateData.map((day) => (
                                <MenuItem value={day} key={day}>{day}</MenuItem>
                            ))}
                        </SelectComponent>
                    )}
                />
                <Controller
                    name="birthDate.mounth"
                    control={control}
                    render={({ field }) => (
                        <SelectComponent
                            className={styles.mounthDropdown}
                            disabled={isLocked}
                            value={field.value}
                        >
                            {birthMounthData.map((mounth) => (
                                <MenuItem value={mounth} key={mounth}>{t(`info.${mounth}`)}</MenuItem>
                            ))}
                        </SelectComponent>
                    )}
                />
                <InputControl
                    type="number"
                    disabled={isLocked}
                    control={control}
                    name="birthdate.year"
                />
            </div>
        </div>
    );
});
