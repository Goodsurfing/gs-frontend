import React, { ChangeEvent, FC } from "react";

import { useTranslation } from "react-i18next";
import SwitchComponent from "@/shared/ui/Switch/Switch";

import styles from "./ProfileHideSwitch.module.scss";

interface ProfileHideSwitchProps {
    checked?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHideSwitch: FC<ProfileHideSwitchProps> = ({
    checked,
    onChange,
}) => {
    const { t } = useTranslation("profile");
    return (
        <div className={styles.wrapper}>
            <SwitchComponent checked={checked} onChange={onChange} />
            <span className={styles.title}>
                {t("privacy.Деактивировать и скрыть мой аккаунт")}
            </span>
        </div>
    );
};
