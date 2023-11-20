import { FC } from "react";

import { HostFill } from "@/features/HostFill";

import { RequestsWidget } from "@/widgets/RequestsWidget";
import { CalendarWidget } from "@/widgets/CalendarWidget";

import { DashboardNotifications } from "@/widgets/DashboardNotifications/";

import styles from "./HostDashboard.module.scss";

const HostDashboardPage: FC = () => (
    <div className={styles.dashboard}>
        <HostFill />
        <div className={styles.columns}>
            <RequestsWidget />
            <CalendarWidget />
            <DashboardNotifications />
        </div>
    </div>
);

export default HostDashboardPage;
