import { OfferWhenForm } from "@/features/OfferWhen";

import styles from "./OfferWhenPage.module.scss";

const OfferWhenPage = () => (
    <div className={styles.wrapper}>
        <h1 className={styles.title}>
            Укажите на какой срок или сроки вам нужен волонтер
        </h1>
        <OfferWhenForm />
    </div>
);

export default OfferWhenPage;
