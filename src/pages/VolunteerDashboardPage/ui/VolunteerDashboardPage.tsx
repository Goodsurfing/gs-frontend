import React from "react";

import { VolunteerFill } from "@/features/VolunteerFill";
import { OffersRecomendationsWidget } from "@/widgets/OffersRecomendationsWidget";
import { MemberBanner } from "@/features/MemberBanner";
import { DashboardNotifications } from "@/widgets/DashboardNotifications";
import styles from "./VolunteerDashboardPage.module.scss";

const VolunteerDashboardPage = () => (
    <div className={styles.dashboard}>
        <VolunteerFill />
        <div className={styles.columns}>
            <OffersRecomendationsWidget />
            <div className={styles.container}>
                <MemberBanner className={styles.banner} />
                <DashboardNotifications className={styles.notifications} />
            </div>
        </div>
    </div>
);

export default VolunteerDashboardPage;
