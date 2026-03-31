import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import {
    getFundraiseStepPageUrl,
    getHostDonationsPageUrl,
} from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import styles from "./FundraiseWelcomePage.module.scss";

const FundraiseWelcomePage: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation("host");
    const { id } = useParams<{ id: string }>();

    const path = id
        ? getFundraiseStepPageUrl(locale, "where", id)
        : getHostDonationsPageUrl(locale);

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{t("hostFundraiseWelcome.Привет!")}</h1>
            <p className={styles.description}>
                {t("hostFundraiseWelcome.description")}
            </p>
            <p className={styles.hint}>
                {t("hostFundraiseWelcome.hint")}
            </p>
            <ButtonLink type="primary" path={path} className={styles.btn}>
                {t("hostFundraiseWelcome.Начать")}
            </ButtonLink>
        </div>
    );
};

export default FundraiseWelcomePage;
