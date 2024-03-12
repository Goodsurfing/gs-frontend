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
    const isShowPaymentCard = offer.conditions.payment.contribution
        || offer.conditions.payment.reward;

    return (
        <div className={cn(className)}>
            <OfferWhenCard offerWhen={offer.when} />
            <OfferWhoNeedsCard
                whoNeeds={offer.whoNeeds}
                className={styles.container}
            />
            {offer.finishingTouches.extraConditions && (
                <OfferConditionsCard
                    finishingTouches={offer.finishingTouches}
                    className={styles.wrapper}
                />
            )}
            {isShowPaymentCard && (
                <OfferPaymentCard
                    payment={offer.conditions.payment}
                    className={styles.container}
                />
            )}
            <OfferDescriptionCard
                description={offer.description}
                className={styles.container}
            />
            <OfferLanguagesCard
                languages={offer.whoNeeds.languages}
                className={styles.container}
            />
            <OfferAddressCard address={address} className={styles.container} />
            <OfferOrganizationCard
                className={styles.container}
            />
            <OfferGalleryCard
                gallery={offer.description.images}
                className={styles.container}
            />
            <OfferWhatToDoCard
                whatToDo={offer.whatToDo}
                className={styles.wrapper}
            />
            <OfferTermsCard
                facilities={offer.conditions.facilities}
                className={styles.container}
            />
            {offer.conditions.extraConditions && (
                <OfferExtraConditionsCard
                    extraConditions={offer.conditions.extraConditions}
                    className={styles.container}
                />
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
