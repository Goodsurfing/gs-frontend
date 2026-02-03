import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";
import styles from "./OfferWherePage.module.scss";
import { OfferWhere } from "@/widgets/Offer";

const OfferWherePage = () => {
    const { t } = useTranslation("offer");
    const { id } = useParams<{ id: string; }>();

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{t("where.Где вы находитесь или будете принимать волонтеров")}</h1>
            {id && <OfferWhere offerId={id} className={styles.form} />}
        </div>
    );
};

export default OfferWherePage;
