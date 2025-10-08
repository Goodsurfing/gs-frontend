import { useTranslation } from "react-i18next";
import { OfferWhenForm } from "@/features/Offer";

import styles from "./OfferWhenPage.module.scss";

const OfferWhenPage = () => {
    const { t } = useTranslation("offer");
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>
                {t("when.Укажите на какой срок или сроки вам нужен волонтер")}
            </h1>
            <OfferWhenForm />
        </div>
    );
};

export default OfferWhenPage;
