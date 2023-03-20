import React, { FC } from "react";

import styles from './HostDashboardRequest.module.scss';
import HostDashboardRequestCard from "./HostDashboardRequestCard/HostDashboardRequestCard";


interface IHostDashboardRequest {

}

const HostDashboardRequest: FC<IHostDashboardRequest> = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <h3 className={styles.title}>Заявки</h3>
                <p className={styles.requests}>Новых заявок: <span className={styles.requestsCount}></span></p>
            </div>
            <div className={styles.requestsItems}>
                <HostDashboardRequestCard />
            </div>
        </div>
    );
}

export default HostDashboardRequest;