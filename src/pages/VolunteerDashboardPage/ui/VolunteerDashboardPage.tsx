import React from "react";

import { VolunteerFill } from "@/features/VolunteerFill";
import { OffersRecomendationsWidget } from "@/widgets/OffersRecomendationsWidget";
import { MemberBanner } from "@/features/MemberBanner";
import { FreeApplicationsCounter } from "@/features/FreeApplicationsCounter";
import { DashboardNotifications } from "@/widgets/DashboardNotifications";
import { useGetProfileOccupancyQuery } from "@/entities/Profile";
import styles from "./VolunteerDashboardPage.module.scss";

const VolunteerDashboardPage = () => {
    const { data: profileOccupancy } = useGetProfileOccupancyQuery();

    return (
        <div className={styles.dashboard}>
            <VolunteerFill />
            <div className={styles.columns}>
                <OffersRecomendationsWidget />
                <div className={styles.container}>
                    <FreeApplicationsCounter className={styles.applicationsCounter} />
                    {!profileOccupancy?.isMembership && <MemberBanner className={styles.banner} />}
                    <DashboardNotifications className={styles.notifications} />
                </div>
            </div>
        </div>
    );
};

export default VolunteerDashboardPage;
