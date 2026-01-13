import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { OfferWhen } from "@/widgets/Offer";
import styles from "./OfferWhenPage.module.scss";

const OfferWhenPage = () => {
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
            {id && (
                <OfferWhen offerId={id} />
            )}
        </div>
    );
};

export default OfferWhenPage;
