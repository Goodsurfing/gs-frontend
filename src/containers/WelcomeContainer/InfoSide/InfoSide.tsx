import React, { FC } from "react";

import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";

import ActivityContainer from "@/containers/WelcomeContainer/InfoSide/ActivityContainer/ActivityContainer";
import InfoHeader from "@/containers/WelcomeContainer/InfoSide/InfoHeader/InfoHeader";

import styles from "./InfoSide.module.scss";
import {useTranslation} from "react-i18next";

const InfoSide: FC = () => {
    const {t} = useTranslation();

    return (
        <div className={styles.wrapper}>
            <InfoHeader />
            <div className={styles.content}>
                <div className={styles.info}>
                    <SectionTitle classNames={styles.title}>
                        Найдите путешествие мечты
                    </SectionTitle>
                    <ButtonLink
                        className={styles.btn}
                        type={"primary"}
                        path={"/"}
                    >
                        {t("main.welcome.header.offers-btn")}
                    </ButtonLink>
                </div>
                <div className={styles.activity}>
                    <h3 className={styles.activityTitle}>
                        Или выберите вид деятельности
                    </h3>
                    <ActivityContainer />
                </div>
            </div>
        </div>
    );
};

export default InfoSide;
