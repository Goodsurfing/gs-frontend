import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import styles from "./OfferWelcomePage.module.scss";

const OfferWelcome: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation("offer");
    const { id } = useParams();
    const path = id ? `/${locale}/offers/where/${id}` : `${getMainPageUrl(locale)}`;

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{t("welcome.Привет!")}</h1>
            <p className={styles.description}>
                {t(
                    "welcome.Здесь вы можете создать и добавить на сайт свое мероприятие. А между тем мы будем предлагать вам полезные советы и примеры.",
                )}
            </p>
            <p className={styles.hint}>
                {t(
                    "welcome.Теперь на сайте можно проводить мероприятия, поэтому мы рады, что вас заинтересовало это и вы хотите присоединиться к растущему сообществу гудсерферов. Нам не терпится взглянуть, чем вы нас обрадуете.",
                )}
            </p>
            <ButtonLink type="primary" path={path} className={styles.btn}>
                {t("welcome.Начать")}
            </ButtonLink>
        </div>
    );
};

export default OfferWelcome;
