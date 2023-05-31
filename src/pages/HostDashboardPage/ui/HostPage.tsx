import React, { FC } from "react";

import HostDashboardCalendar from "../HostDashboardCalendar/HostDashboardCalendar";
import HostDashboardNotifications from "../HostDashboardNotifications/HostDashboardNotifications";
import HostDashboardRequest from "../HostDashboardRequest/HostDashboardRequest";
import HostProfileFill from "../HostProfileFill/HostProfileFill";

import styles from "./HostDashboard.module.scss";

const HostPage: FC = () => (
    <div className={styles.dashboard}>
        <HostProfileFill />
        <div className={styles.columns}>
            <HostDashboardRequest />
            <HostDashboardCalendar />
            <HostDashboardNotifications />
        </div>
    </div>
);

export default HostPage;
