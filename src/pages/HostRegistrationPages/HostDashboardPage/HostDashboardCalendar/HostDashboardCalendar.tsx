import React from "react";
import Button from "@/components/ui/Button/Button";
import { Variant } from "@/components/ui/Button/Button.interface";

import styles from "./HostDashboardCalendar.module.scss";

import CalendarComponent from "@/components/ui/CalendarComponent/CalendarComponent";

const HostDashboardCalendar = () => {
    return (
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
};

export default React.memo(HostDashboardCalendar);
