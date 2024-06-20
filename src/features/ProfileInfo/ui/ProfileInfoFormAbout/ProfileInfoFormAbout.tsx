import { memo } from "react";
import { useFormContext } from "react-hook-form";
import cn from "classnames";

import { useTranslation } from "react-i18next";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { useAppSelector } from "@/shared/hooks/redux";

import { getProfileReadonly } from "@/entities/Profile";

import styles from "./ProfileInfoFormAbout.module.scss";

interface ProfileInfoFormAboutProps {
    className?: string;
}

export const ProfileInfoFormAbout = memo((props: ProfileInfoFormAboutProps) => {
    const { className } = props;
    const { t } = useTranslation("profile");
    const isLocked = useAppSelector(getProfileReadonly);

    const { control } = useFormContext();

    return (
        <div className={cn(className, styles.wrapper)}>
            <InputControl
                disabled={isLocked}
                label={t("info.Имя")}
                control={control}
                name="about.firstName"
            />
            <InputControl
                disabled={isLocked}
                label={t("info.Фамилия")}
                control={control}
                name="about.lastName"
            />
        </div>
    );
});
