import { FC } from "react";

import { useTranslation } from "react-i18next";
import { HostFill } from "@/features/HostFill";

import { RequestsWidget } from "@/widgets/RequestsWidget";

import { DashboardNotifications } from "@/widgets/DashboardNotifications/";
import { MemberBanner } from "@/features/MemberBanner";

import styles from "./HostDashboard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

const HostDashboardPage: FC = () => {
    const { t, ready } = useTranslation("host");
    const { ready: volunteerReady } = useTranslation("volunteer");
    const { locale } = useLocale();

    if (!ready || !volunteerReady) {
        return (
            <div className={styles.dashboard}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <HostFill />
            <div className={styles.columns}>
                <RequestsWidget locale={locale} />
                {/* <CalendarWidget /> add this logic in future */}
                <MemberBanner
                    title={t("host-dashboard.Зарегистрируй членство организатора и получи больше возможностей для своего проекта!")}
                    buttonText={t("host-dashboard.Получить членство")}
                    anchor="host"
                />
                <DashboardNotifications />
            </div>
        </div>
    );
};

export default HostDashboardPage;
