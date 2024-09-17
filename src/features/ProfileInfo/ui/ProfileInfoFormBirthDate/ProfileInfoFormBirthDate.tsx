import { MenuItem } from "@mui/material";
import cn from "classnames";
import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { getProfileReadonly } from "@/entities/Profile";

import { useAppSelector } from "@/shared/hooks/redux";
import { SelectComponent } from "@/shared/ui/Select/Select";

import { birthDateData, birthMounthData, getMaxDaysInMonth } from "../../model/data/birthData";
import styles from "./ProfileInfoFormBirthDate.module.scss";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import Input from "@/shared/ui/Input/Input";
import { ProfileInfoFields } from "../../model/types/profileInfo";

interface ProfileInfoFormBirthDateProps {
    className?: string;
}

export const ProfileInfoFormBirthDate = memo(
    (props: ProfileInfoFormBirthDateProps) => {
        const { className } = props;
        const isLocked = useAppSelector(getProfileReadonly);
        const { control, watch, formState: { errors } } = useFormContext<ProfileInfoFields>();
        const { t } = useTranslation("profile");

        const selectedMonth = watch("birthDate.mounth");
        const selectedYear = watch("birthDate.year");

        const maxDays = getMaxDaysInMonth(selectedMonth, selectedYear);

        const filteredDays = birthDateData.filter((day) => day <= maxDays);

        return (
            <div className={cn(className, styles.wrapper)}>
                <span className={styles.text}>{t("info.День рождения")}</span>
                <div className={styles.container}>
                    <Controller
                        name="birthDate.day"
                        control={control}
                        rules={{
                            required: "Day is required",
                            min: {
                                value: 1,
                                message: "Day must be at least 1",
                            },
                            validate: (value) => {
                                if (value > maxDays) {
                                    return `Day cannot be greater than ${maxDays} in ${birthMounthData[selectedMonth]}`;
                                }
                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <SelectComponent
                                onChange={field.onChange}
                                className={styles.dayDropdown}
                                disabled={isLocked}
                                value={field.value}
                            >
                                {filteredDays.map((day) => (
                                    <MenuItem value={day} key={day}>
                                        {day}
                                    </MenuItem>
                                ))}
                            </SelectComponent>
                        )}
                    />
                    <Controller
                        name="birthDate.mounth"
                        control={control}
                        rules={{ required: "Month is required" }}
                        render={({ field }) => (
                            <SelectComponent
                                onChange={field.onChange}
                                className={styles.mounthDropdown}
                                disabled={isLocked}
                                value={field.value}
                            >
                                {birthMounthData.map((mounth, index) => (
                                    <MenuItem value={index + 1} key={index}>
                                        {t(`info.${mounth}`)}
                                    </MenuItem>
                                ))}
                            </SelectComponent>
                        )}
                    />
                    <Controller
                        name="birthDate.year"
                        control={control}
                        rules={{
                            required: "Year is required",
                            min: {
                                value: 1900,
                                message: "Year must be greater than or equal to 1900",
                            },
                            max: {
                                value: new Date().getFullYear(),
                                message: "Year cannot be in the future",
                            },
                        }}
                        render={({ field }) => (
                            <Input
                                type="number"
                                disabled={isLocked}
                                value={field.value}
                                onChange={(event) => {
                                    const { value } = event.target;
                                    if (value.length <= 4) {
                                        field.onChange(Number(value));
                                    }
                                }}
                                onInput={(event) => {
                                    const input = event.target as HTMLInputElement;
                                    if (input.value.length > 4) {
                                        input.value = input.value.slice(0, 4);
                                    }
                                }}
                            />
                        )}
                    />
                </div>
                <div>
                    {errors.birthDate?.day?.message
                                && <ErrorText text={errors.birthDate.day.message} />}
                    {errors.birthDate?.mounth?.message
                                && <ErrorText text={errors.birthDate?.mounth.message} />}
                    {errors.birthDate?.year?.message
                                && <ErrorText text={errors.birthDate.year.message} />}
                </div>
            </div>
        );
    },
);
