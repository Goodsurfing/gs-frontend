import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import {
    RequestCard,
    useGetMyHostApplicationsQuery,
} from "@/entities/Application";

import Button from "@/shared/ui/Button/Button";

import styles from "./RequestsWidget.module.scss";

interface RequestsWidgetProps {
    className?: string;
}

export const RequestsWidget = memo((props: RequestsWidgetProps) => {
    const { className } = props;
    const {
        data: applications,
        isLoading: isApplicationsLoading,
    } = useGetMyHostApplicationsQuery();
    const { t } = useTranslation("host");

    const renderRequests = () => {
        if (isApplicationsLoading) return <p>{t("host-dashboard.Загрузка...")}</p>;
        if (!applications) return null;

        const limitedApplications = applications.slice(0, 10);

        return limitedApplications.map((application) => (
            <RequestCard key={application.id} application={application} />
        ));
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.titleWrapper}>
                <h3 className={styles.title}>{t("host-dashboard.Заявки")}</h3>
                <p className={styles.requests}>
                    {t("host-dashboard.Новых заявок")}
                    {": "}
                    <span className={styles.requestsCount}>
                        {applications ? applications.length : 0}
                    </span>
                </p>
            </div>
            <div className={styles.requestsItems}>
                {renderRequests()}
                {applications?.length && (
                    <Button variant="FILL" color="BLUE" size="MEDIUM">
                        {t("host-dashboard.Посмотреть все")}
                    </Button>
                )}
            </div>
        </div>
    );
});
