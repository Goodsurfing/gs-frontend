import React from 'react';
import Button from 'components/ui/Button/Button';
import { Variant } from 'components/ui/Button/Button.interface';

import CalendarComponent from 'components/ui/CalendarComponent/CalendarComponent';
import styles from './HostDashboardCalendar.module.scss';

const HostDashboardCalendar = () => (
    <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
            <h3 className={styles.title}>Календарь</h3>
        </div>
        <div className={styles.calendarWrapper}>
            <CalendarComponent />
            <div className={styles.btnWrapper}>
                <Button className={styles.btn} variant={Variant.PRIMARY} rounded>
                    Посмотреть все
                </Button>
            </div>
        </div>
    </div>
);

export default React.memo(HostDashboardCalendar);
