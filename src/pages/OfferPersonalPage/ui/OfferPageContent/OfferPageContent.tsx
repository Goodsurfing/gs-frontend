import { memo } from "react";

import cn from "classnames";

import styles from "./OfferPageContent.module.scss";

interface OfferPageContentProps {
    className?: string;
    id: string;
}

export const OfferPageContent = memo((props: OfferPageContentProps) => {
    const { className, id } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            {/* <OfferWhen /> */}
            {/* <OfferWhoNeeds /> */}
            {/* <OfferRequirements /> */}
            {/* <OfferDescription /> */}
            {/* <OfferLocation /> */}
            {/* <OfferMainInfo /> */}
            {/* <OfferGallery /> */}
            {/* <OfferWhatToDo /> */}
            {/* <OfferConditions /> */}
            {/* <OfferParticipations /> */}
            {/* <OfferReviews /> */}
            {/* <OfferArticles /> */}
            {/* <OfferShare /> */}
        </div>
    );
});
