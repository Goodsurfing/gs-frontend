import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getMainPageUrl, getProfilePrivacyPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import styles from "./UnsubscribedPage.module.scss";

/**
 * Куда ведёт ссылка «Отписаться» из рекламного письма: бэкенд уже снял
 * согласие на рассылку и перенаправил сюда; status=invalid — ссылка испорчена.
 * Сервисные письма (заявки, членство, пароль) приходят и после отписки.
 */
const UnsubscribedPage: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const [params] = useSearchParams();
    const invalid = params.get("status") === "invalid";

    return (
        <SignLayout cancelText={t("login.Отменить")} cancelPath={getMainPageUrl(locale)}>
            <div className={styles.wrapper}>
                <SignTitle>{t("unsubscribed.title")}</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        {invalid ? t("unsubscribed.invalid") : t("unsubscribed.done")}
                    </div>
                    <p>{t("unsubscribed.hint")}</p>
                    <ButtonLink className={styles.btn} path={getProfilePrivacyPageUrl(locale)} type="outlined">
                        {t("unsubscribed.settings")}
                    </ButtonLink>
                </div>
            </div>
        </SignLayout>
    );
};

export default UnsubscribedPage;
