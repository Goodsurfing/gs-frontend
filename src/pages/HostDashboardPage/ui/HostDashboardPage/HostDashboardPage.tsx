import { FC } from "react";

import { HostFill } from "@/features/HostFill";

import { RequestsWidget } from "@/widgets/RequestsWidget";
import { CalendarWidget } from "@/widgets/CalendarWidget";

import HostDashboardNotifications from "../HostDashboardNotifications/HostDashboardNotifications";

import styles from "./HostDashboard.module.scss";

const HostDashboardPage: FC = () => (
    <div className={styles.dashboard}>
        <HostFill />
        <div className={styles.columns}>
            <RequestsWidget />
            <CalendarWidget />
            <HostDashboardNotifications />
        </div>
    </div>
);

export default HostDashboardPage;
