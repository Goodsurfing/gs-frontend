import React, { FC } from "react";

import styles from "./HostDashboard.module.scss";
import HostDashboardRequest from "../HostDashboardRequest/HostDashboardRequest";
import HostProfileFill from "../HostProfileFill/HostProfileFill";
import HostDashboardCalendar from "../HostDashboardCalendar/HostDashboardCalendar";
import HostDashboardNotifications from "../HostDashboardNotifications/HostDashboardNotifications";
import { HostPageLayout } from "@/widgets/HostPageLayout";

const HostDashboardPage: FC = () => {
    return (
        <HostPageLayout>
            <div className={styles.dashboard}>
                <HostProfileFill />
                <div className={styles.columns}>
                    <HostDashboardRequest />
                    <HostDashboardCalendar />
                    <HostDashboardNotifications />
                </div>
            </div>
        </HostPageLayout>
    );
};

export default HostDashboardPage;
