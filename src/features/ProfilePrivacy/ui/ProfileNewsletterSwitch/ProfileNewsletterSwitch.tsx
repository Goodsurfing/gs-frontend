import React, { ChangeEvent, FC } from "react";

import SwitchComponent from "@/shared/ui/Switch/Switch";

import styles from "./ProfileNewsletterSwitch.module.scss";

interface ProfileNewsletterSwitchProps {
    checked?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileNewsletterSwitch: FC<ProfileNewsletterSwitchProps> = ({
    checked,
    onChange,
}) => (
    <div className={styles.wrapper}>
        <SwitchComponent checked={checked} onChange={onChange} />
        <span className={styles.title}>
            Не присылать мне рассылку от Гусдёрфинга с новостями и обновлениями
        </span>
    </div>
);
