import React from "react";
import Button from "@/shared/ui/Button/Button";
import CalendarComponent from "@/shared/ui/CalendarComponent/CalendarComponent";

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
                    color="BLUE"
                    variant="FILL"
                    size="MEDIUM"
                >
                    Посмотреть все
                </Button>
            </div>
        </div>
    </div>
);

export default React.memo(HostDashboardCalendar);
