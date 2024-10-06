import cn from "classnames";
import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { getProfileReadonly } from "@/entities/Profile";

import { useAppSelector } from "@/shared/hooks/redux";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import Input from "@/shared/ui/Input/Input";

import { ProfileInfoFields } from "../../model/types/profileInfo";
import styles from "./ProfileInfoFormAbout.module.scss";

interface ProfileInfoFormAboutProps {
    className?: string;
}

export const ProfileInfoFormAbout = memo((props: ProfileInfoFormAboutProps) => {
    const { className } = props;
    const { t } = useTranslation("profile");
    const isLocked = useAppSelector(getProfileReadonly);

    const {
        control,
        formState: { errors },
    } = useFormContext<ProfileInfoFields>();

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.input}>
                <Controller
                    control={control}
                    name="about.firstName"
                    rules={{ required: t("info.Это поле является обязательным") }}
                    render={({ field }) => (
                        <Input
                            label={t("info.Имя")}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isLocked}
                        />
                    )}
                />
                {errors.about?.firstName?.message && (
                    <ErrorText text={errors.about.firstName.message} className={styles.error} />
                )}
            </div>
            <div className={styles.input}>
                <Controller
                    control={control}
                    name="about.lastName"
                    rules={{ required: t("info.Это поле является обязательным") }}
                    render={({ field }) => (
                        <Input
                            label={t("info.Фамилия")}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isLocked}
                        />
                    )}
                />
                {errors.about?.lastName?.message && (
                    <ErrorText text={errors.about.lastName.message} className={styles.error} />
                )}
            </div>
        </div>
    );
});
