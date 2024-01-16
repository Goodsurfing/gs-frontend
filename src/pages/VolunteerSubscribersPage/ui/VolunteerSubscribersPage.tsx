import React from "react";

import { useTranslation } from "react-i18next";
import { SubscribersWidget } from "@/widgets/SubscribersWidget";

import { mockedVolunteerData } from "@/entities/Volunteer/model/data/mockedVolunteerData";

import styles from "./VolunteerSubscribersPage.module.scss";

const VolunteerSubscribersPage = () => {
    const { t } = useTranslation("volunteer");
    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-subscribers.Подписки")}</h2>
            <SubscribersWidget
                subscribers={mockedVolunteerData.subscribers}
                className={styles.container}
            />
        </div>
    );
};

export default VolunteerSubscribersPage;
