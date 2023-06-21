import React from "react";

import styles from "./OfferWhenPage.module.scss";
import { ParticipationDatesForm } from "@/modules/ParticipationDatesForm";
import { SideMenuData } from "@/shared/data/offer-pages";
import { PageLayout } from "@/widgets/PageLayout";

const OfferWhenPage = () => {
    return (
        <PageLayout sidebarContent={SideMenuData}>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>
                    Укажите на какой срок или сроки вам нужен волонтер
                </h1>
                <ParticipationDatesForm />
            </div>
        </PageLayout>
    );
};

export default OfferWhenPage;
