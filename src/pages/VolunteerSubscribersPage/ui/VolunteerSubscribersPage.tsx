import React from "react";

import { SubscribersWidget } from "@/widgets/SubscribersWidget";

import { mockedVolunteerData } from "@/entities/Volunteer/model/data/mockedVolunteerData";

import styles from "./VolunteerSubscribersPage.module.scss";

const VolunteerSubscribersPage = () => (
    <div className={styles.wrapper}>
        <h2>Подписки</h2>
        <SubscribersWidget
            subscribers={mockedVolunteerData.subscribers}
            className={styles.container}
        />
    </div>
);

export default VolunteerSubscribersPage;
