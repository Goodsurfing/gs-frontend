import { SideMenuData } from "@/shared/data/offer-pages";
import { PageLayout } from "@/widgets/PageLayout";

import styles from "./OfferWherePage.module.scss";
import { AddressForm } from "@/widgets/AddressForm";

const OfferWherePage = () => (
    <PageLayout sidebarContent={SideMenuData}>
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Где вы находитесь или будете приниать волонтеров</h1>
            <AddressForm className={styles.form} />
        </div>
    </PageLayout>
);

export default OfferWherePage;
