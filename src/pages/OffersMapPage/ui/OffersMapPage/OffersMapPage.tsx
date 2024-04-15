import React, { useCallback, useState } from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import { OffersList, OffersMap } from "@/widgets/OffersMap";

import styles from "./OffersMapPage.module.scss";

const OffersMapPage = () => {
    const [isMapOpened, setMapOpened] = useState<boolean>(true);

    const handleMapOpen = useCallback(() => {
        setMapOpened((prev) => !prev);
    }, []);

    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <div className={styles.wrapperOffersMap}>
                    <OffersList
                        onChangeMapOpen={handleMapOpen}
                        mapOpenValue={isMapOpened}
                        className={styles.offersList}
                    />
                    <OffersMap className={styles.offersMap} classNameMap={styles.offersMap} />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default OffersMapPage;
