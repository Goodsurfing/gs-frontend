import React, { FC } from "react";

import styles from './HostDashboardRequest.module.scss';
import HostDashboardRequestCard from "./HostDashboardRequestCard/HostDashboardRequestCard";

import { DashboardRequestData } from "./HostDashboardRequest.data";
import Button from "@/components/ui/Button/Button";
import { Variant } from "@/components/ui/Button/Button.interface";

interface IHostDashboardRequest {

}

const HostDashboardRequest: FC<IHostDashboardRequest> = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <h3 className={styles.title}>Заявки</h3>
                <p className={styles.requests}>Новых заявок: <span className={styles.requestsCount}>{DashboardRequestData.length}</span></p>
            </div>
            <div className={styles.requestsItems}>
                {DashboardRequestData.map((card) => {
                    return <HostDashboardRequestCard key={card.user.name} user={card.user} notification={card.notification} article={card.article}/>
                })}
                <Button variant={Variant.PRIMARY} rounded>Посмотреть все</Button>
            </div>
        </div>
    );
}

export default HostDashboardRequest;