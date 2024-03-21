import { memo } from "react";
import cn from "classnames";

import { RequestCard } from "@/entities/Request";
import { useUser } from "@/entities/Profile";

import Button from "@/shared/ui/Button/Button";

import styles from "./RequestsWidget.module.scss";

interface RequestsWidgetProps {
    className?: string;
}

export const RequestsWidget = memo((props: RequestsWidgetProps) => {
    const { className } = props;
    const { isLoading, profile: userData } = useUser();

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.titleWrapper}>
                <h3 className={styles.title}>Заявки</h3>
                <p className={styles.requests}>
                    Новых заявок:
                    {" "}
                    <span className={styles.requestsCount}>10</span>
                </p>
            </div>
            <div className={styles.requestsItems}>
                {isLoading
                    ? "...Загрузка"
                    : (
                        userData && <RequestCard article="Даб даб да я" notificationType="new" user={userData} />
                    )}
                <Button
                    variant="FILL"
                    color="BLUE"
                    size="MEDIUM"
                >
                    Посмотреть все
                </Button>
            </div>
        </div>
    );
});
