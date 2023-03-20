import React, { FC, Suspense, useState } from "react";

import styles from './HostDashboard.module.scss';
import HostDashboardRequest from "./HostDashboardRequest/HostDashboardRequest";
import HostProfileFill from "./HostProfileFill/HostProfileFill";

const HostDashboardPage: FC = () => {
    return (
        <div className={styles.dashboard}>
            <HostProfileFill />
            <div className={styles.columns}>
                <HostDashboardRequest />
                <HostDashboardRequest />
                <HostDashboardRequest />
            </div>
        </div>
    );
};

export default HostDashboardPage;