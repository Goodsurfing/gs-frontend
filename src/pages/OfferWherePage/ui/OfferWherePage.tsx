import { AddressForm } from "@/widgets/AddressForm";

import styles from "./OfferWherePage.module.scss";

const OfferWherePage = () => (
    <div className={styles.wrapper}>
        <h1 className={styles.title}>Где вы находитесь или будете приниать волонтеров</h1>
        <AddressForm className={styles.form} />
    </div>
);

export default OfferWherePage;
