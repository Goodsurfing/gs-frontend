import React, { FC } from "react";

import styles from './HostDashboard.module.scss';
import HostDashboardRequest from "./HostDashboardRequest/HostDashboardRequest";
import HostProfileFill from "./HostProfileFill/HostProfileFill";
import HostDashboardCalendar from "./HostDashboardCalendar/HostDashboardCalendar";
import HostDashboardNotifications from "./HostDashboardNotifications/HostDashboardNotifications";

const HostDashboardPage: FC = () => {
    return (
        <div className={styles.dashboard}>
            <HostProfileFill />
            <div className={styles.columns}>
                <HostDashboardRequest />
                <HostDashboardCalendar />
                <HostDashboardNotifications />
            </div>
        </div>
    );
};

export default HostDashboardPage;