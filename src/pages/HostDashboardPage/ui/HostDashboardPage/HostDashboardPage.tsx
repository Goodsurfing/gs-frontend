import { FC } from "react";

import styles from "./HostDashboard.module.scss";
import HostDashboardRequest from "../HostDashboardRequest/HostDashboardRequest";
import HostProfileFill from "../HostProfileFill/HostProfileFill";
import HostDashboardCalendar from "../HostDashboardCalendar/HostDashboardCalendar";
import HostDashboardNotifications from "../HostDashboardNotifications/HostDashboardNotifications";
import { PageLayout } from "@/widgets/PageLayout";
import { HostPagesSidebarData } from "@/shared/data/host-pages";

const HostDashboardPage: FC = () => (
    <PageLayout sidebarContent={HostPagesSidebarData}>
        <div className={styles.dashboard}>
            <HostProfileFill />
            <div className={styles.columns}>
                <HostDashboardRequest />
                <HostDashboardCalendar />
                <HostDashboardNotifications />
            </div>
        </div>
    </PageLayout>
);

export default HostDashboardPage;
