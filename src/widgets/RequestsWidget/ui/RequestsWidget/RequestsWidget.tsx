import { memo } from "react";
import cn from "classnames";

import { RequestCard } from "@/entities/Request";

import Button from "@/shared/ui/Button/Button";

import styles from "./RequestsWidget.module.scss";
import { useGetMyApplicationsQuery } from "@/entities/Host/api/hostApi";

interface RequestsWidgetProps {
    className?: string;
}

export const RequestsWidget = memo((props: RequestsWidgetProps) => {
    const { className } = props;
    const { data: applications, isLoading: isApplicationsLoading } = useGetMyApplicationsQuery();

    const renderRequests = () => {
        if (!applications) return null;
        return applications.map((application) => (
            <RequestCard application={application} />
        ));
    };

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
                {isApplicationsLoading
                    ? "...Загрузка"
                    : (
                        renderRequests()
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
