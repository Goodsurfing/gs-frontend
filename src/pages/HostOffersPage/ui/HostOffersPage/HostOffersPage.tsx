import { MyOffers, OfferStatus } from "@/entities/Offer";
import { useGetMyOffersQuery } from "@/entities/Offer/api/offerApi";

import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { HostOffersList } from "../HostOffersList/HostOffersList";
import { AddOffer } from "@/features/Offer/AddOffer/AddOffer";
import styles from "./HostOffersPage.module.scss";

const HostOffersPage = () => {
    const { data: offers, isLoading, isError } = useGetMyOffersQuery();

    if (isLoading) {
        return <Preloader />;
    }

    const filterOffersByStatus = (
        offersList: MyOffers | undefined,
        targetStatus: OfferStatus,
    ): MyOffers | undefined => {
        if (!offersList) return;
        const { list } = offersList;
        const result = list.filter((offer) => offer.status === targetStatus);
        return { list: result } as MyOffers;
    };

    return (
        <div className={styles.wrapper}>
            {isError && (
                <HintPopup
                    text="Ошибка вывода списка вакансий"
                    type={HintType.Error}
                />
            )}
            <h2 className={styles.abilities}>Мои возможности</h2>
            <HostOffersList offers={filterOffersByStatus(offers, "open")} />
            <div className={styles.drafts}>
                <h2 className={styles.draftsTitle}>Черновики</h2>
                <div className={styles.cards}>
                    <HostOffersList offers={filterOffersByStatus(offers, "closed")} />
                </div>
            </div>
            <AddOffer />
        </div>
    );
};

export default HostOffersPage;
