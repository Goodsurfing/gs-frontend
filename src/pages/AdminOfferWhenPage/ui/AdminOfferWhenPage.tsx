import { useTranslation } from "react-i18next";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./AdminOfferWhenPage.module.scss";
import { AdminOfferWhenForm } from "@/widgets/Admin";

const AdminOfferWhenPage = () => {
    const { t, ready } = useTranslation("offer");

    if (!ready) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>
                {t("when.Укажите на какой срок или сроки вам нужен волонтер")}
            </h1>
            <AdminOfferWhenForm />
        </div>
    );
};

export default AdminOfferWhenPage;
