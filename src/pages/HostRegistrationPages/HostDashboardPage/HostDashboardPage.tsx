import React, { FC, Suspense, useState } from "react";

import styles from './HostDashboard.module.scss';
import HostProfileFill from "./HostProfileFill/HostProfileFill";

const HostDashboardPage: FC = () => {
    return (
        <div className={styles.dashboard}>
            <HostProfileFill />
        </div>
    );
};

export default HostDashboardPage;