import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import {
    ProfileDeleteSwitch,
    ProfileHideSwitch,
    ProfileNewsletterSwitch,
} from "@/features/ProfilePrivacy";

import styles from "./ProfilePrivacy.module.scss";

export const ProfilePrivacy: FC = memo(() => {
    const { t } = useTranslation("profile");

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <ProfileHideSwitch />
                <p className={styles.description}>
                    {t("privacy.Деактивировав аккаунт вы делаете его недоступным для остальных")}
                </p>
            </div>
            <div className={styles.container}>
                <ProfileNewsletterSwitch />
                <p className={styles.description}>
                    {t("privacy.Отказавшись от рассылки вы можете пропустить важные новости проекта, а также уникальные возможности")}
                </p>
            </div>
            <div className={styles.container}>
                <ProfileDeleteSwitch />
                <div className={styles.iconContainer}>
                    <div className={styles.errorLineIcon} />
                    <p className={styles.description}>
                        {t("privacy.Нажимая эту кнопку вы удаляете ваш аккаунт со всей заполненной вами информацией")}
                    </p>
                </div>
            </div>
        </div>
    );
});
