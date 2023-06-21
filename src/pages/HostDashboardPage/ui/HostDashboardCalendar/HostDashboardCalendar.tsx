import React from "react";
import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";
import CalendarComponent from "@/UI/CalendarComponent/CalendarComponent";

import styles from "./HostDashboardCalendar.module.scss";

const HostDashboardCalendar = () => {
    return (
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
};

export default React.memo(HostDashboardCalendar);
