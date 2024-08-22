import { FC } from "react";

import { useTranslation } from "react-i18next";
import { HostFill } from "@/features/HostFill";

import { RequestsWidget } from "@/widgets/RequestsWidget";

import { DashboardNotifications } from "@/widgets/DashboardNotifications/";

import styles from "./HostDashboard.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";

const HostDashboardPage: FC = () => {
    const { ready } = useTranslation("host");

    if (!ready) {
        return (
            <div className={styles.dashboard}>
                <Preloader />
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <HostFill />
            <div className={styles.columns}>
                <RequestsWidget />
                {/* <CalendarWidget /> add this logic in future */}
                <DashboardNotifications />
            </div>
        </div>
    );
};

export default HostDashboardPage;
