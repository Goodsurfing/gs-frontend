import cn from "classnames";
import { memo } from "react";

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
    const address = "Казань улица Пушкина, 46";
    const isShowPaymentCard = offer.conditions?.volunteerContributions
        || offer.conditions?.volunteerRemuneration;

    return (
        <div className={cn(className)}>
            {offer.when && <OfferWhenCard offerWhen={offer.when} />}
            {offer.howNeeds && (
                <OfferWhoNeedsCard
                    whoNeeds={offer.howNeeds}
                    className={styles.container}
                />
            )}
            {offer.finishingTouches && (
                <OfferConditionsCard
                    finishingTouches={offer.finishingTouches}
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
            {offer.howNeeds && (
                <OfferLanguagesCard
                    languages={offer.howNeeds.requiredLanguages}
                    className={styles.container}
                />
            )}
            <OfferAddressCard address={address} className={styles.container} />
            <OfferOrganizationCard
                className={styles.container}
            />
            {offer.galleryItems && (
                <OfferGalleryCard
                    gallery={offer.galleryItems}
                    className={styles.container}
                />
            )}
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
                        className={styles.container}
                    />
                    <OfferExtraConditionsCard
                        extraConditions={offer.conditions.additionalConditions}
                        className={styles.container}
                    />
                </>
            )}
            <OfferContributorsCard
                contributors={offer.contributors}
                className={styles.wrapper}
            />
            {offer?.reviews && <OfferReviewsCard reviews={offer.reviews} />}
            {offer?.articles && (
                <OfferArticlesCard
                    articles={offer.articles}
                    className={styles.container}
                />
            )}
            <OfferShareCard />
        </div>
    );
});
