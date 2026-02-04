import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { Offer } from "../../model/types/offer";
import { OfferAddressCard } from "../OfferAddressCard/OfferAddressCard";
import { OfferArticlesCard } from "../OfferArticlesCard/ui/OfferArticlesCard/OfferArticlesCard";
import { OfferConditionsCard } from "../OfferConditionsCard/OfferConditionsCard";
import { OfferContributorsCard } from "../OfferContributorsCard/OfferContributorsCard";
import { OfferDescriptionCard } from "../OfferDescriptionCard/OfferDescriptionCard";
import { OfferExtraConditionsCard } from "../OfferExtraConditionsCard/OfferExtraConditionsCard";
import { OfferGalleryCard } from "../OfferGalleryCard/OfferGalleryCard";
import { OfferLanguagesCard } from "../OfferLanguagesCard/OfferLanguagesCard";
import { OfferOrganizationCard } from "../OfferOrganizationCard/OfferOrganizationCard";
import { OfferPaymentCard } from "../OfferPaymentCard/OfferPaymentCard";
import { OfferReviewsCard } from "../OfferReviewsCard/ui/OfferReviewsCard/OfferReviewsCard";
import { OfferShareCard } from "../OfferShareCard/OfferShareCard";
import { OfferTermsCard } from "../OfferTermsCard/ui/OfferTermsCard/OfferTermsCard";
import { OfferWhatToDoCard } from "../OfferWhatToDoCard/OfferWhatToDoCard";
import { OfferWhenCard } from "../OfferWhenCard/OfferWhenCard";
import { OfferWhoNeedsCard } from "../OfferWhoNeedsCard/OfferWhoNeedsCard";
import styles from "./OfferInfoCard.module.scss";

interface HostInfoCardProps {
    className?: string;
    offer: Offer;
}

export const OfferInfoCard = memo((props: HostInfoCardProps) => {
    const { className, offer } = props;
    const isShowPaymentCard = (offer.condition?.volunteerContributions ?? null) !== null
    || (offer.condition?.volunteerRemuneration ?? null) !== null;
    const { ready } = useTranslation("offer");

    if (!ready) {
        return null;
    }

    return (
        <div className={cn(className)}>
            {offer.when && <OfferWhenCard offerWhen={offer.when} />}
            {offer.howNeed && (
                <OfferWhoNeedsCard
                    whoNeeds={offer.howNeed}
                    className={styles.container}
                />
            )}
            {offer.whatToDo && (
                <OfferWhatToDoCard
                    whatToDo={offer.whatToDo}
                    className={styles.wrapper}
                />
            )}
            {offer.description && (
                <OfferDescriptionCard
                    description={offer.description}
                    className={styles.container}
                />
            )}
            {offer.condition && (
                <>
                    <OfferTermsCard
                        facilities={offer.condition.conveniences}
                        housing={offer.condition.houses}
                        paidTravel={offer.condition.transfers}
                        nutrition={offer.condition.foods}
                        extraFeatures={offer.condition.additionalFeatures}
                        className={styles.container}
                    />
                    <OfferExtraConditionsCard
                        extraConditions={offer.condition.additionalConditions}
                        className={styles.container}
                    />
                </>
            )}
            {offer.finishingTouche && (
                <OfferConditionsCard
                    finishingTouches={offer.finishingTouche}
                    className={styles.wrapper}
                />
            )}
            {(offer.condition && isShowPaymentCard) && (
                <OfferPaymentCard
                    conditions={offer.condition}
                    className={styles.container}
                />
            )}

            {offer.howNeed && (
                <OfferLanguagesCard
                    languages={offer.howNeed.languages}
                    className={styles.container}
                />
            )}
            {offer.where && (
                <OfferAddressCard
                    address={offer.where}
                    className={styles.container}
                />
            )}
            <OfferGalleryCard
                galleryImages={offer.galleryImages}
                className={styles.container}
            />
            <OfferOrganizationCard
                organization={offer.organization}
                className={styles.container}
            />
            <OfferContributorsCard
                offerId={offer.id}
                className={styles.wrapper}
            />
            <OfferReviewsCard
                canReview={offer.canReview}
                offerId={offer.id}
            />
            {offer.articles && (
                <OfferArticlesCard
                    articles={offer.articles}
                    className={styles.container}
                />
            )}
            {offer.description && (
                <OfferShareCard
                    offerId={offer.id.toString()}
                    offerTitle={offer.description?.title}
                />
            )}
        </div>
    );
});
