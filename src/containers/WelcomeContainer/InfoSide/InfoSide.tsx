import React, { FC } from "react";

import Button from "@/components/ui/Button/Button";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";

import ActivityContainer from "@/containers/WelcomeContainer/InfoSide/ActivityContainer/ActivityContainer";
import InfoHeader from "@/containers/WelcomeContainer/InfoSide/InfoHeader/InfoHeader";

import styles from "./InfoSide.module.scss";

const InfoSide: FC = () => {
    return (
        <div className={styles.wrapper}>
            <InfoHeader />
            <div className={styles.content}>
                <div className={styles.info}>
                    <SectionTitle classNames={styles.title}>
                        Найдите путешествие мечты
                    </SectionTitle>
                    <Button type={"primary"} path={"/"}>
                        Все предложения
                    </Button>
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
