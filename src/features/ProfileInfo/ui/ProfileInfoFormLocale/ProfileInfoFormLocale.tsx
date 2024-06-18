import { memo } from "react";
import cn from "classnames";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MenuItem } from "@mui/material";

import { SelectComponent } from "@/shared/ui/Select/Select";
import { useAppSelector } from "@/shared/hooks/redux";

import { getProfileReadonly } from "@/entities/Profile";

import styles from "./ProfileInfoFormLocale.module.scss";
import { localeLanguage } from "../../model/data/localeData";

interface ProfileInfoFormLocaleProps {
    className?: string;
}

export const ProfileInfoFormLocale = memo((props: ProfileInfoFormLocaleProps) => {
    const { className } = props;
    const { control } = useFormContext();
    const { t } = useTranslation("profile");

    const isLocked = useAppSelector(getProfileReadonly);

    return (
        <div className={cn(className, styles.wrapper)}>
            <Controller
                name="locale.country"
                control={control}
                render={({ field }) => (
                    <SelectComponent
                        disabled={isLocked}
                        className={styles.dropdown}
                        onChange={field.onChange}
                        value={field.value}
                        label={t("info.Страна")}
                    >
                        {}
                    </SelectComponent>
                )}
            />
            <Controller
                name="locale.city"
                control={control}
                render={({ field }) => (
                    <SelectComponent
                        disabled={isLocked}
                        className={styles.dropdown}
                        onChange={field.onChange}
                        value={field.value}
                        label={t("info.Город")}
                    >
                        {}
                    </SelectComponent>
                )}
            />
            <Controller
                name="locale.language"
                control={control}
                render={({ field }) => (
                    <SelectComponent
                        disabled={isLocked}
                        className={styles.dropdown}
                        onChange={field.onChange}
                        value={field.value}
                        label={t("info.Язык интерфейса")}
                    >
                        {localeLanguage.map((lang) => (
                            <MenuItem value={lang.value} key={lang.value}>{lang.name}</MenuItem>
                        ))}
                    </SelectComponent>
                )}
            />
        </div>
    );
});
