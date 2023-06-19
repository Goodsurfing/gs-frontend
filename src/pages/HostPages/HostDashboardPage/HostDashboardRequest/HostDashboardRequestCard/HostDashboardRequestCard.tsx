import cn from 'classnames';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import styles from './HostDashboardRequestCard.module.scss';
import { IHostDashboardRequestCard } from './types';

const HostDashboardRequestCard: FC<IHostDashboardRequestCard> = ({
  user,
  notification,
  article,
}) => (
    <div className={styles.cardWrapper}>
        <div className={styles.cardHead}>
            <div className={cn(styles.notification, {
              [styles.new]: notification === 'новая',
              [styles.rejected]: notification === 'отклонена',
              [styles.completed]: notification === 'принята',
            })}
            >
                {notification}
            </div>
            {user.image ? (
                <img src={user.image} alt="" className={styles.image} />
            ) : (
                <div className={styles.image} />
            )}
            <div className={styles.text}>
                <p className={styles.name}>{user.name}</p>
                <p className={styles.location}>{user.location}</p>
            </div>
        </div>
        <div className={styles.linkWrapper}>
            <Link className={styles.link} to="/">
                {article}
            </Link>
        </div>
    </div>
);

export default React.memo(HostDashboardRequestCard);
