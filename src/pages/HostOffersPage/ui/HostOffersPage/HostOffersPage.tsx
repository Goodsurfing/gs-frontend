import Preloader from "@/shared/ui/Preloader/Preloader";

import { HostOffersList } from "../HostOffersList/HostOffersList";
import { AddOffer } from "@/features/Offer/AddOffer/AddOffer";
import { filterOffersByStatus } from "../../lib/filterOffersByStatus";
import { useGetMyOffers } from "@/entities/Offer";
import styles from "./HostOffersPage.module.scss";

const HostOffersPage = () => {
    const { data: myOffers, isLoading } = useGetMyOffers();
    // const { data: myOffers, isOffersLoading} = useGetHostOffersByIdQuery(myHost.id);
    const offersWithOpenStatus = filterOffersByStatus(myOffers, "open");
    const offersWithEmptyStatus = filterOffersByStatus(myOffers, "empty");

    if (isLoading) {
        return <Preloader />;
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.abilities}>Мои возможности</h2>
            <HostOffersList offers={offersWithOpenStatus} />
            {offersWithEmptyStatus && (
                <div className={styles.drafts}>
                    <h2 className={styles.draftsTitle}>Черновики</h2>
                    <div className={styles.cards}>
                        <HostOffersList offers={offersWithEmptyStatus} />
                    </div>
                </div>
            )}
            <AddOffer />
        </div>
    );
};

export default HostOffersPage;
