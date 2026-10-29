import React, {
    ChangeEvent, FC, memo, useCallback,
} from "react";

import { useTranslation } from "react-i18next";
import SwitchComponent from "@/shared/ui/Switch/Switch";

import styles from "./ProfileNewsletterSwitch.module.scss";

interface ProfileNewsletterSwitchProps {
    checked?: boolean;
    disabled?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileNewsletterSwitch: FC<ProfileNewsletterSwitchProps> = memo(
    ({ checked, disabled, onChange }: ProfileNewsletterSwitchProps) => {
        const handleOnChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => onChange?.(event),
            [onChange],
        );
        const { t } = useTranslation("profile");

        return (
            <div className={styles.wrapper}>
                <SwitchComponent
                    checked={checked}
                    disabled={disabled}
                    onChange={handleOnChange}
                    inputProps={{ "aria-labelledby": "newsletter-switch-title" }}
                />
                <span id="newsletter-switch-title" className={styles.title}>
                    {t("privacy.Получать рассылку от Гудсёрфинга с новостями и обновлениями")}
                </span>
            </div>
        );
    },
);
