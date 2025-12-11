import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import cn from "classnames";
import { MenuItem } from "@mui/material";

import { useTranslation } from "react-i18next";
import { SelectComponent } from "@/shared/ui/Select/Select";
import { useAppSelector } from "@/shared/hooks/redux";

import { getProfileReadonly } from "@/entities/Profile";

import styles from "./ProfileInfoFormGender.module.scss";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { ProfileInfoFields } from "../../model/types/profileInfo";

interface ProfileInfoFormGenderProps {
    className?: string;
}

export const ProfileInfoFormGender = memo((props: ProfileInfoFormGenderProps) => {
    const { className } = props;
    const { t } = useTranslation("profile");
    const isLocked = useAppSelector(getProfileReadonly);

    const { control, formState: { errors } } = useFormContext<ProfileInfoFields>();

    return (
        <div className={cn(className, styles.wrapper)}>
            <Controller
                name="gender"
                control={control}
                rules={{ required: t("info.Это поле является обязательным") }}
                render={({ field }) => (
                    <SelectComponent
                        value={field.value}
                        label={t("info.Пол")}
                        disabled={isLocked}
                        className={styles.genderDropdown}
                        onChange={field.onChange}
                    >
                        <MenuItem key="male" value="male">{t("info.Мужчина")}</MenuItem>
                        <MenuItem key="female" value="female">{t("info.Женщина")}</MenuItem>
                        <MenuItem key="other" value="other">{t("info.Другой")}</MenuItem>
                    </SelectComponent>
                )}
            />
            {errors.gender?.message && (
                <ErrorText text={errors.gender.message} className={styles.error} />
            )}
        </div>
    );
});
