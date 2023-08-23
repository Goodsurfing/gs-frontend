import { memo } from "react";
import cn from "classnames";

import styles from "./NotificationsWidget.module.scss";

interface NotificationsWidgetProps {
    className?: string;
}

export const NotificationsWidget = memo((props: NotificationsWidgetProps) => {
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
