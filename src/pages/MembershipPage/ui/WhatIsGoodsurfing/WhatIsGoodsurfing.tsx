import cn from "classnames";
import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button/Button";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getProfileRolePagePageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./WhatIsGoodsurfing.module.scss";

interface WhatIsGoodsurfingProps {
    className?: string;
}

export const WhatIsGoodsurfing: FC<WhatIsGoodsurfingProps> = (
    props: WhatIsGoodsurfingProps,
) => {
    const { className } = props;
    const { t } = useTranslation("membership");
    const navigate = useNavigate();
    const { locale } = useLocale();

    const handleNavigateToRole = () => {
        navigate(getProfileRolePagePageUrl(locale));
    };

    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.content}>
                <h2 className={styles.title}>
                    {t("what-is-goodsurfing.Что делает Гудсёрфинг и как он помогает развиваться сообществу")}
                </h2>
                <p className={styles.description}>
                    {t("what-is-goodsurfing.Миссия Гудсёрфинга – развитие выездного добровольчества в России и мире с помощью создания удобного веб-сервиса и распространения информации о подобных возможностях. В рамках этой миссии мы постоянно занимаемся развитием технологической части сервиса, готовим и распространяем полезный контент, формируем образовательные программы.")}
                    <br />
                    {t("what-is-goodsurfing.Мы уверены, что тысячи людей разделят с нами наши ценности в путешествиях со смыслом и готовы поддержать нас, оформив членство в сообществе. А мы в свою очередь сделаем для них всё возможное, чтобы их путешествия со смыслом были комфортными, полезными для общества и не забываемыми.")}
                </p>
                <Button color="BLUE" size="MEDIUM" variant="FILL" className={styles.button} onClick={handleNavigateToRole}>
                    {t("what-is-goodsurfing.Начать сейчас")}
                </Button>
            </div>
            <div className={styles.image} />
        </section>
    );
};
