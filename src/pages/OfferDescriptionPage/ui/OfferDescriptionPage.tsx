import { InviteDescriptionForm } from "@/modules/InviteDescriptionForm";
import { SideMenuData } from "@/shared/data/offer-pages";
import { PageLayout } from "@/widgets/PageLayout";

import styles from "./OfferDescriptionPage.module.scss";

const OfferDescriptionPage = () => (
    <PageLayout sidebarContent={SideMenuData}>
        <div className={styles.wrapper}>
            <InviteDescriptionForm />
        </div>
    </PageLayout>
);

export default OfferDescriptionPage;
