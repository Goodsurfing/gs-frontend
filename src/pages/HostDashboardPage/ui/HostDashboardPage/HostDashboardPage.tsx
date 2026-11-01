import { FC } from "react";

import { useTranslation } from "react-i18next";
import { HostFill } from "@/features/HostFill";

import { RequestsWidget } from "@/widgets/RequestsWidget";

import { DashboardNotifications } from "@/widgets/DashboardNotifications/";
import { MemberBanner } from "@/features/MemberBanner";
import { PublishedVacanciesCounter } from "@/features/PublishedVacanciesCounter";
import { hasHostMembership, useGetProfileOccupancyQuery } from "@/entities/Profile";

import styles from "./HostDashboard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

const HostDashboardPage: FC = () => {
    const { t, ready } = useTranslation("host");
    const { ready: volunteerReady } = useTranslation("volunteer");
    const { locale } = useLocale();
    const { data: profileOccupancy } = useGetProfileOccupancyQuery();

    if (!ready || !volunteerReady) {
        return (
            <div className={styles.dashboard}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <HostFill extra={<PublishedVacanciesCounter />} />
            <div className={styles.columns}>
                <RequestsWidget locale={locale} />
                {/* <CalendarWidget /> add this logic in future */}
                {/* GS-202: как у волонтёра — справа одна колонка: баннер, под ним
                    уведомления. Раньше баннер был отдельной ячейкой сетки и
                    растягивался на высоту заявок серым прямоугольником. */}
                <div className={styles.container}>
                    {!hasHostMembership(profileOccupancy) && (
                        <MemberBanner
                            className={styles.banner}
                            title={t("host-dashboard.Зарегистрируй членство организатора и получи больше возможностей для своего проекта!")}
                            buttonText={t("host-dashboard.Получить членство")}
                            anchor="host"
                        />
                    )}
                    <DashboardNotifications className={styles.notifications} />
                </div>
            </div>
        </div>
    );
};

export default HostDashboardPage;
