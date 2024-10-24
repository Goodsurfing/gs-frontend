import React, { FC } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getBecomeHostPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import SectionTitle from "@/shared/ui/SectionTitle/SectionTitle";

import styles from "./BecomeHostContainer.module.scss";

const BecomeHostContainer: FC = () => {
    const { locale } = useLocale();
    return (
        <div className={styles.wrapper}>
            <SectionTitle>Прими гудсёрферов</SectionTitle>
            <p className={styles.text}>
                Получайте помощь в своём деле и знакомьтесь с людьми со всего
                мира. Гудсёрферы не только принесут пользу, но и помогут
                познакомиться с новыми культурами, распространить информацию о
                вас, получить экспертов по различным направлениям.
            </p>
            <ButtonLink path={getBecomeHostPageUrl(locale)} type="primary">
                Стать хостом
            </ButtonLink>
        </div>
    );
};

export default BecomeHostContainer;
