import React from "react";

import { SubscribersWidget } from "@/widgets/SubscribersWidget";

import { mockedVolunteerData } from "@/entities/Volunteer/model/data/mockedVolunteerData";

import styles from "./VolunteerSubscribersPage.module.scss";

const VolunteerSubscribersPage = () => (
    <div className={styles.wrapper}>
        <SubscribersWidget subscribers={mockedVolunteerData.subscribers} />
    </div>
);

export default VolunteerSubscribersPage;
