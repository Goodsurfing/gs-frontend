import React, { FC } from "react";
import { Link } from "react-router-dom";

import styles from "./HostDashboardRequestCard.module.scss";

export interface IRequestUser {
    name: string;
    location: string;
    image: string;
}

export enum RequestNotification {
    NEW = 'new',
    COMPLETED = 'completed',
    REJECTED = 'rejected'
}

export interface IRequestNotification {
    status: RequestNotification;
}

interface IHostDashboardRequestCard {
    user: IRequestUser;
    notification: IRequestNotification;
    article: string;
}

const HostDashboardRequestCard: FC = () => {
    return (
        <div className={styles.cardWrapper}>
            <div className={styles.cardHead}>
                <div className={styles.notification}>Статус</div>
                {/* Данные картинку получаем из объекта, которого пока что нет, так что костыль */}
                {false ? <img src="" alt="" className={styles.image} /> : <div className={styles.image}></div>}
                <div className={styles.text}>
                    <p className={styles.name}>Станислав <br /> Старовойтов</p>
                    <p className={styles.location}>Санкт-Петербург, Россия</p>                    
                </div>

            </div>
            <Link className={styles.link} to='/'>Опушкинская археологическая экспедиция в Крыму: сезон-2020</Link>
        </div>
    );
};

export default React.memo(HostDashboardRequestCard);
