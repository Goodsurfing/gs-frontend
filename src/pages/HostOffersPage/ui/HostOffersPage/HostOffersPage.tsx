import { useGetMyOffersQuery } from "@/entities/Offer/api/offerApi";

import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { HostOffersList } from "../HostOffersList/HostOffersList";
import { AddOffer } from "@/features/Offer/AddOffer/AddOffer";
import { filterOffersByStatus } from "../../lib/filterOffersByStatus";
import styles from "./HostOffersPage.module.scss";

const HostOffersPage = () => {
    const { data: offers, isLoading, isError } = useGetMyOffersQuery();
    const offersWithOpenStatus = filterOffersByStatus(offers, "open");
    const offersWithClosedStatus = filterOffersByStatus(offers, "closed");

    if (isLoading) {
        return <Preloader />;
    }

    return (
        <div className={styles.wrapper}>
            {isError && (
                <HintPopup
                    text="Ошибка вывода списка вакансий"
                    type={HintType.Error}
                />
            )}
            <h2 className={styles.abilities}>Мои возможности</h2>
            <HostOffersList offers={offersWithOpenStatus} />
            {offersWithClosedStatus && (
                <div className={styles.drafts}>
                    <h2 className={styles.draftsTitle}>Черновики</h2>
                    <div className={styles.cards}>
                        <HostOffersList offers={offersWithClosedStatus} />
                    </div>
                </div>
            )}
            <AddOffer />
        </div>
    );
};

export default HostOffersPage;
