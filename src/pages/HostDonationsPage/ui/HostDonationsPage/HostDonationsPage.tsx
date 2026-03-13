import { FC } from "react";

import { useTranslation } from "react-i18next";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { HostDonationsTable } from "@/widgets/Donation";
import styles from "./HostDonationsPage.module.scss";

const HostDonationsPage: FC = () => {
    const { t, ready } = useTranslation("host");
    const { ready: volunteerReady } = useTranslation("volunteer");

    if (!ready || !volunteerReady) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <h2>{t("hostDonations.Пожертвования")}</h2>
            <HostDonationsTable />
        </div>
    );
};

export default HostDonationsPage;
