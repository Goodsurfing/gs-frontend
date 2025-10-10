import React, { FC } from "react";
import { ReactSVG } from "react-svg";
import { useTranslation } from "react-i18next";
import infoIcon from "@/shared/assets/icons/icon-info.svg";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import styles from "./ProfileInfoVerifyEmail.module.scss";
import { getVerifyEmailPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

export const ProfileInfoVerifyEmail: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation("profile");
    return (
        <div className={styles.wrapper}>
            <ReactSVG src={infoIcon} className={styles.icon} />
            <p>{t("info.Вам нужно подтвердить вашу электронную почту.")}</p>
            <ButtonLink path={getVerifyEmailPageUrl(locale)} type="primary" className={styles.button}>
                {t("info.Подтвердить")}
            </ButtonLink>
        </div>
    );
};
