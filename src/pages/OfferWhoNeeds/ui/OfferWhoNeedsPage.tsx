import { useTranslation } from "react-i18next";
import { WhoNeedsForm } from "@/features/OfferWhoNeedsForm";

import styles from "./OfferWhoNeedsPage.module.scss";

const OffersWhoNeedsPage = () => {
    const { t } = useTranslation("offer");

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{t("whoNeeds.Кого бы вы хотели видеть у себя в волонтерах")}</h1>
            <p className={styles.subtitle}>
                {t("whoNeeds.Опишите, что должен уметь волонтер, что он должен делать и на каких языках вы с ним можете общаться.")}
            </p>
            <WhoNeedsForm />
        </div>
    );
};

export default OffersWhoNeedsPage;
