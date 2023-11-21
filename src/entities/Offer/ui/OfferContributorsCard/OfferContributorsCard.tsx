import cn from "classnames";
import React, { FC, memo } from "react";
import { Link } from "react-router-dom";
import arrowIcon from "@/shared/assets/icons/arrow-down.svg";

import { useLocale } from "@/app/providers/LocaleProvider";

import { OfferContributorCard } from "@/entities/Volunteer/ui/OfferContributorCard/OfferContributorCard";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";

import { OfferContributor } from "../../model/types/offerContributor";
import styles from "./OfferContributorsCard.module.scss";

interface OfferContributorsCardProps {
    contributors: OfferContributor[];
    className?: string;
}

const RENDER_EIGHT_CARDS = [0, 8];

export const OfferContributorsCard: FC<OfferContributorsCardProps> = memo(
    (props: OfferContributorsCardProps) => {
        const { contributors, className } = props;
        const { locale } = useLocale();

        const renderCards = (contributorsData: OfferContributor[]) => contributorsData
            .slice(...RENDER_EIGHT_CARDS)
            .map(({ avatar, name }, index) => (
                <OfferContributorCard
                    avatar={avatar}
                    name={name}
                    key={index}
                />
            ));

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>Участники(54)</h3>
                <p className={styles.description}>
                    В нашем сообществе вы можете поговорить с волонтерами,
                    которые уже сотрудничали с этим хостом, и получить прямые
                    ответы на свои вопросы.
                </p>
                <div className={styles.container}>
                    {renderCards(contributors)}
                </div>
                <Link to={getMainPageUrl(locale)} className={styles.text}>
                    Показать всех
                    {" "}
                    <img src={arrowIcon} alt="arrow-icon" />
                </Link>
            </div>
        );
    },
);
