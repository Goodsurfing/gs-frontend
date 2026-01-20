import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { AdminOfferWhen } from "@/widgets/Admin";
import styles from "./AdminOfferWhenPage.module.scss";

const AdminOfferWhenPage = () => {
    const { t, ready } = useTranslation("offer");
    const { id } = useParams<{ id: string }>();

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
            {id && <AdminOfferWhen offerId={id} />}
        </div>
    );
};

export default AdminOfferWhenPage;
