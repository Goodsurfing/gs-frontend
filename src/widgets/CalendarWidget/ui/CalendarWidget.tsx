import { memo } from "react";
import cn from "classnames";

import styles from "./CalendarWidget.module.scss";
import CalendarComponent from "@/shared/ui/CalendarComponent/CalendarComponent";
import Button from "@/shared/ui/Button/Button";

interface CalendarWidgetProps {
    className?: string;
}

export const CalendarWidget = memo((props: CalendarWidgetProps) => {
    const { className } = props;
    return (
        <div className={cn(styles.wrapper, className)}>
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
});
