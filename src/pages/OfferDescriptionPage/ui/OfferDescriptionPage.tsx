import { useParams } from "react-router-dom";
import { OfferDescription } from "@/widgets/Offer";
import styles from "./OfferDescriptionPage.module.scss";

const OfferDescriptionPage = () => {
    const { id } = useParams<{ id: string; }>();

    return (
        <div className={styles.wrapper}>
            <h1>Описание вакансии</h1>
            {id && <OfferDescription offerId={id} />}
        </div>
    );
};

export default OfferDescriptionPage;
