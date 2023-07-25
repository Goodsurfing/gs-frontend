import { SideMenuData } from "@/shared/data/offer-pages";
import { PageLayout } from "@/widgets/PageLayout";

import { AddressForm } from "@/widgets/AddressForm";

import styles from "./OfferWherePage.module.scss";

const OfferWherePage = () => (
    <PageLayout sidebarContent={SideMenuData}>
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Где вы находитесь или будете приниать волонтеров</h1>
            <AddressForm className={styles.form} />
        </div>
    </PageLayout>
);

export default OfferWherePage;
