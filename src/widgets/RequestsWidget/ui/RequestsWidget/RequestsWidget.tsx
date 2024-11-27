import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import {
    RequestCard,
    useGetMyHostApplicationsQuery,
} from "@/entities/Application";

import Button from "@/shared/ui/Button/Button";

import styles from "./RequestsWidget.module.scss";
import { getHostNotesPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/entities/Locale";
import { Text } from "@/shared/ui/Text/Text";

interface RequestsWidgetProps {
    className?: string;
    locale: Locale;
}

export const RequestsWidget = memo((props: RequestsWidgetProps) => {
    const { className, locale } = props;
    const {
        data: applications,
        isLoading: isApplicationsLoading,
    } = useGetMyHostApplicationsQuery();
    const { t } = useTranslation("host");
    const navigate = useNavigate();

    const navigateTo = () => {
        navigate(getHostNotesPageUrl(locale));
    };

    const renderRequests = () => {
        if (isApplicationsLoading) return <p>{t("host-dashboard.Загрузка...")}</p>;
        if (!applications || applications.length === 0) {
            return (<Text text="На данный момент заявки отсутсвуют" />);
        }

        const limitedApplications = applications.slice(-10);

        return limitedApplications.map((application) => (
            <RequestCard key={application.id} application={application} locale={locale} />
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
            <div className={styles.requestsWrapper}>
                <div className={styles.requestsItems}>
                    {renderRequests()}
                </div>
                {applications?.length ? (
                    <Button variant="FILL" color="BLUE" size="MEDIUM" onClick={navigateTo}>
                        {t("host-dashboard.Посмотреть все")}
                    </Button>
                ) : null}
            </div>
        </div>
    );
});
