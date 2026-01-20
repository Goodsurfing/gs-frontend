import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { OfferWhoNeeds } from "@/widgets/Offer";

import styles from "./OfferWhoNeedsPage.module.scss";

const OffersWhoNeedsPage = () => {
    const { t } = useTranslation("offer");
    const { id } = useParams<{ id: string; }>();

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{t("whoNeeds.Кого бы вы хотели видеть у себя в волонтерах")}</h1>
            <p className={styles.subtitle}>
                {t("whoNeeds.Опишите, что должен уметь волонтер, что он должен делать и на каких языках вы с ним можете общаться.")}
            </p>
            {id && <OfferWhoNeeds offerId={id} />}
        </div>
    );
};

export default OffersWhoNeedsPage;
