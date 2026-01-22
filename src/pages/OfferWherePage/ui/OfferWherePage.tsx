import { useTranslation } from "react-i18next";

import styles from "./OfferWherePage.module.scss";

const OfferWherePage = () => {
    const { t } = useTranslation("offer");

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{t("where.Где вы находитесь или будете принимать волонтеров")}</h1>
            <AddressForm className={styles.form} />
        </div>
    );
};

export default OfferWherePage;
