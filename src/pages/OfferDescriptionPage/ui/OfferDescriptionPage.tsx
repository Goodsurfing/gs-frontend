import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OfferDescription } from "@/widgets/Offer";
import styles from "./OfferDescriptionPage.module.scss";

const OfferDescriptionPage = () => {
    const { t } = useTranslation("offer");
    const { id } = useParams<{ id: string; }>();

    return (
        <div className={styles.wrapper}>
            <h1>{t("Описание вакансии")}</h1>
            {id && <OfferDescription offerId={id} />}
        </div>
    );
};

export default OfferDescriptionPage;
