import { SideMenuData } from "@/shared/data/offer-pages";

import { OfferWhenForm } from "@/features/OfferWhen";

import { PageLayout } from "@/widgets/PageLayout";

import styles from "./OfferWhenPage.module.scss";

const OfferWhenPage = () => (
    <PageLayout sidebarContent={SideMenuData}>
        <div className={styles.wrapper}>
            <h1 className={styles.title}>
                Укажите на какой срок или сроки вам нужен волонтер
            </h1>
            <OfferWhenForm />
        </div>
    </PageLayout>
);

export default OfferWhenPage;
