import { WhoNeedsForm } from "@/modules/WhoNeedsForm";
import { SideMenuData } from "@/shared/data/offer-pages";
import { PageLayout } from "@/widgets/PageLayout";

import styles from "./OfferWhoNeedsPage.module.scss";

const OffersWhoNeedsPage = () => (
    <PageLayout sidebarContent={SideMenuData}>
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Кого бы вы хотели видеть у себя в волонтерах</h1>
            <p className={styles.subtitle}>
                Опишите, что должен уметь волонтер,
                что он должен делать и на каких языках вы с ним можете общаться.
            </p>
            <WhoNeedsForm />
        </div>
    </PageLayout>
);

export default OffersWhoNeedsPage;
