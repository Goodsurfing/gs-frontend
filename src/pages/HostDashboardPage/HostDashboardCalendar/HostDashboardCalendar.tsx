import React from "react";

import Button from "shared/ui/Button/Button";
import { Variant } from "shared/ui/Button/ui/Button.interface";
import CalendarComponent from "shared/ui/CalendarComponent/CalendarComponent";

import styles from "./HostDashboardCalendar.module.scss";

const HostDashboardCalendar = () => (
    <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
            <h3 className={styles.title}>Календарь</h3>
        </div>
        <div className={styles.calendarWrapper}>
            <CalendarComponent onChange={() => {}} value={new Date()} />
            <div className={styles.btnWrapper}>
                <Button
                    className={styles.btn}
                    variant={Variant.PRIMARY}
                    rounded
                >
                    Посмотреть все
                </Button>
            </div>
        </div>
    </div>
);

export default React.memo(HostDashboardCalendar);
