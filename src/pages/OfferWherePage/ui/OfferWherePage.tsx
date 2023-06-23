import React from "react";
import { SideMenuData } from "@/shared/data/offer-pages";
import { PageLayout } from "@/widgets/PageLayout";

import styles from "./OfferWherePage.module.scss";
import { MapWithAddress } from "@/features/MapWithAddress/ui/MapWithAddress";

export interface IOfferWherePageForm {
    address: string;
}

const OfferWherePage = () => {
    return (
        <PageLayout sidebarContent={SideMenuData}>
            <div className={styles.wrapper}>
                <form>
                    <div className={styles.ymaps}>
                        <MapWithAddress />
                    </div>
                </form>
            </div>
        </PageLayout>
    );
};

export default OfferWherePage;
