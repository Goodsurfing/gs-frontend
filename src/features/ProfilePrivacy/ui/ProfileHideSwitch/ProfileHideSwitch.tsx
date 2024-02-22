import React, { ChangeEvent, FC } from "react";

import SwitchComponent from "@/shared/ui/Switch/Switch";

import styles from "./ProfileHideSwitch.module.scss";

interface ProfileHideSwitchProps {
    checked?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHideSwitch: FC<ProfileHideSwitchProps> = ({
    checked,
    onChange,
}) => (
    <div className={styles.wrapper}>
        <SwitchComponent checked={checked} onChange={onChange} />
        <span className={styles.title}>
            Деактивировать и скрыть мой аккаунт
        </span>
    </div>
);
