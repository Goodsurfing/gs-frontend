import React, { FC, memo } from "react";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { OfferContributorCard } from "@/entities/Volunteer/ui/OfferContributorCard/OfferContributorCard";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";

import { OfferContributor } from "../../model/types/offerContributor";
import styles from "./OfferContributorsCard.module.scss";

interface OfferContributorsCardProps {
    contributors: OfferContributor[];
}

export const OfferContributorsCard: FC<OfferContributorsCardProps> = memo(
    (props: OfferContributorsCardProps) => {
        const { contributors } = props;
        const { locale } = useLocale();

        const renderCards = (contributorsData: OfferContributor[]) => contributorsData
            .slice(0, 8)
            .map(({ avatar, name }) => (
                <OfferContributorCard avatar={avatar} name={name} />
            ));

        return (
            <div className={styles.wrapper}>
                <h3>Участники(54)</h3>
                <p className={styles.description}>
                    В нашем сообществе вы можете поговорить с волонтерами,
                    которые уже сотрудничали с этим хостом, и получить прямые
                    ответы на свои вопросы.
                </p>
                <div className={styles.container}>
                    {renderCards(contributors)}
                </div>
                <Link to={getMainPageUrl(locale)}>Показать всех</Link>
            </div>
        );
    },
);
