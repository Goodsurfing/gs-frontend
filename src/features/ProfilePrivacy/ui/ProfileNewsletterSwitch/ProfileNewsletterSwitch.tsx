import React, {
    ChangeEvent, FC, memo, useCallback,
} from "react";

import { useTranslation } from "react-i18next";
import SwitchComponent from "@/shared/ui/Switch/Switch";

import styles from "./ProfileNewsletterSwitch.module.scss";

interface ProfileNewsletterSwitchProps {
    checked?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileNewsletterSwitch: FC<ProfileNewsletterSwitchProps> = memo(
    ({ checked, onChange }: ProfileNewsletterSwitchProps) => {
        const handleOnChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => onChange?.(event),
            [onChange],
        );
        const { t } = useTranslation("profile");

        return (
            <div className={styles.wrapper}>
                <SwitchComponent checked={checked} onChange={handleOnChange} />
                <span className={styles.title}>
                    {t("privacy.Не присылать мне рассылку от Гусдёрфинга с новостями и обновлениями")}
                </span>
            </div>
        );
    },
);
