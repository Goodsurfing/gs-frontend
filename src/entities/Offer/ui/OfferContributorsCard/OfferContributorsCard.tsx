import React, { FC, memo } from "react";

import styles from "./OfferContributorsCard.module.scss";
import { OfferContributorCard } from "@/entities/Volunteer/ui/OfferContributorCard/OfferContributorCard";

interface OfferContributorsCardProps {}

export const OfferContributorsCard: FC<OfferContributorsCardProps> = memo((
    props: OfferContributorsCardProps,
) => {
    const {} = props;

    return (
        <div className={styles.wrapper}>
            <h3>Участники(54)</h3>
            <p className={styles.description}>
                В нашем сообществе вы можете поговорить с волонтерами, которые
                уже сотрудничали с этим хостом, и получить прямые ответы на свои
                вопросы.
            </p>
            <div className={styles.container}>
                <OfferContributorCard avatar="" name="" />
            </div>
        </div>
    );
});
