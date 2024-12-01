import { MenuItem } from "@mui/material";
import cn from "classnames";
import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { getProfileReadonly } from "@/entities/Profile";

import { useAppSelector } from "@/shared/hooks/redux";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import Input from "@/shared/ui/Input/Input";
import { SelectComponent } from "@/shared/ui/Select/Select";

import {
    birthDateData,
    birthMounthData,
    getMaxDaysInMonth,
} from "../../model/data/birthData";
import { ProfileInfoFields } from "../../model/types/profileInfo";
import styles from "./ProfileInfoFormBirthDate.module.scss";

interface ProfileInfoFormBirthDateProps {
    className?: string;
}

export const ProfileInfoFormBirthDate = memo(
    (props: ProfileInfoFormBirthDateProps) => {
        const { className } = props;
        const isLocked = useAppSelector(getProfileReadonly);
        const {
            control,
            watch,
            formState: { errors },
        } = useFormContext<ProfileInfoFields>();
        const { t } = useTranslation("profile");

        const selectedDay = watch("birthDate.day");
        const selectedMonth = watch("birthDate.mounth");
        const selectedYear = watch("birthDate.year");

        const maxDays = getMaxDaysInMonth(selectedMonth, selectedYear);
        const filteredDays = birthDateData.filter((day) => day <= maxDays);

        const isAnyFieldFilled = !!(
            selectedDay
            || selectedMonth
            || selectedYear
        );

        const validateDay = (value: number) => {
            if (!isAnyFieldFilled) return true;
            if (!value) return t("info.Укажите день");
            if (value > maxDays) return t("info.День_не_может_быть_больше", { maxDays, month: birthMounthData[selectedMonth] });
            return true;
        };

        const validateMonth = (value: number) => {
            if (!isAnyFieldFilled) return true;
            if (!value) return t("info.Укажите месяц");
            return true;
        };

        const validateYear = (value: number) => {
            if (!isAnyFieldFilled) return true;
            if (!value) return t("info.Укажите год");
            if (value < 1900) return t("info.Год должен быть больше или равен 1900");
            if (value > new Date().getFullYear()) return t("info.Не верно указан год");
            return true;
        };

        return (
            <div className={cn(className, styles.wrapper)}>
                <span className={styles.text}>{t("info.День рождения")}</span>
                <div className={styles.container}>
                    <Controller
                        name="birthDate.day"
                        control={control}
                        rules={{
                            validate: validateDay,
                        }}
                        render={({ field }) => (
                            <SelectComponent
                                onChange={field.onChange}
                                className={styles.dayDropdown}
                                disabled={isLocked}
                                value={field.value}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300,
                                        },
                                    },
                                }}
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
                        rules={{
                            validate: validateMonth,
                        }}
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
                            validate: validateYear,
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
                    {errors.birthDate?.day?.message && (
                        <ErrorText text={errors.birthDate.day.message} />
                    )}
                    {errors.birthDate?.mounth?.message && (
                        <ErrorText text={errors.birthDate?.mounth.message} />
                    )}
                    {errors.birthDate?.year?.message && (
                        <ErrorText text={errors.birthDate.year.message} />
                    )}
                </div>
            </div>
        );
    },
);
