import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getMainPageUrl, getProfilePrivacyPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";

import styles from "./SubscriptionPage.module.scss";

/**
 * Куда ведёт кнопка «Да, подписаться» из письма-запроса согласия на рассылку
 * (GS-203): бэкенд ставит согласие и перенаправляет сюда со status=confirmed,
 * а при устаревшей или испорченной ссылке — со status=expired.
 */
const SubscriptionPage: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const [params] = useSearchParams();
    const confirmed = params.get("status") === "confirmed";

    return (
        <SignLayout cancelText={t("login.Отменить")} cancelPath={getMainPageUrl(locale)}>
            <div className={styles.wrapper}>
                <SignTitle>{t("subscription.title")}</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        {confirmed
                            ? t("subscription.confirmed")
                            : t("subscription.expired")}
                    </div>
                    {confirmed && (
                        <p>{t("subscription.unsubscribeHint")}</p>
                    )}
                    <ButtonLink
                        className={styles.btn}
                        path={confirmed ? getMainPageUrl(locale) : getProfilePrivacyPageUrl(locale)}
                        type="outlined"
                    >
                        {confirmed ? t("subscription.home") : t("subscription.settings")}
                    </ButtonLink>
                </div>
            </div>
        </SignLayout>
    );
};

export default SubscriptionPage;
