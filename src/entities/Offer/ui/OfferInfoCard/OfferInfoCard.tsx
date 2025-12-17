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
    const isShowPaymentCard = (offer.conditions?.volunteerContributions ?? null) !== null
    || (offer.conditions?.volunteerRemuneration ?? null) !== null;
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
            {offer.finishingTouche && (
                <OfferConditionsCard
                    finishingTouches={offer.finishingTouche}
                    className={styles.wrapper}
                />
            )}
            {(offer.conditions && isShowPaymentCard) && (
                <OfferPaymentCard
                    conditions={offer.conditions}
                    className={styles.container}
                />
            )}
            {offer.description && (
                <OfferDescriptionCard
                    description={offer.description}
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
            <OfferOrganizationCard
                organization={offer.organization}
                className={styles.container}
            />
            <OfferGalleryCard
                galleryImages={offer.galleryImages}
                className={styles.container}
            />
            {offer.whatToDo && (
                <OfferWhatToDoCard
                    whatToDo={offer.whatToDo}
                    className={styles.wrapper}
                />
            )}
            {offer.conditions && (
                <>
                    <OfferTermsCard
                        facilities={offer.conditions.conveniences}
                        housing={offer.conditions.houses}
                        paidTravel={offer.conditions.transfers}
                        nutrition={offer.conditions.foods}
                        extraFeatures={offer.conditions.additionalFeatures}
                        className={styles.container}
                    />
                    <OfferExtraConditionsCard
                        extraConditions={offer.conditions.additionalConditions}
                        className={styles.container}
                    />
                </>
            )}
            {offer.contributors && (
                <OfferContributorsCard
                    contributors={offer.contributors}
                    className={styles.wrapper}
                />
            )}
            {offer.organization && (
                <OfferReviewsCard
                    hostId={offer.organization.id}
                    offerId={offer.id}
                />
            )}
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
