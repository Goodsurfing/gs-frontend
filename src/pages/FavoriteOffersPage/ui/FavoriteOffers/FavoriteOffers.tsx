import cn from "classnames";
import React, { FC } from "react";

import { ReactSVG } from "react-svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useGetFavoriteOffersQuery } from "@/entities/Offer";
import { getOfferImagePath, OfferCard } from "@/widgets/OffersMap";

import Button from "@/shared/ui/Button/Button";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import emptyIcon from "@/shared/assets/icons/empty-favorite-heart.svg";

import styles from "./FavoriteOffers.module.scss";
import { getOffersMapPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface FavoriteOffersProps {
    className?: string;
}

// Сервер отдаёт не больше 100 за раз; больше в избранном пока ни у кого нет.
const FAVORITES_LIMIT = 100;

export const FavoriteOffers: FC<FavoriteOffersProps> = (props) => {
    const { className } = props;
    const navigate = useNavigate();
    const { locale } = useLocale();
    const { t } = useTranslation("offer");
    const { data, isLoading } = useGetFavoriteOffersQuery({ limit: FAVORITES_LIMIT });

    const viewOffersClick = () => {
        navigate(getOffersMapPageUrl(locale));
    };

    if (isLoading) {
        return <MiniLoader />;
    }

    const offers = data?.data ?? [];

    if (offers.length === 0) {
        return (
            <div className={styles.empty}>
                <p>
                    {t("Вы пока не добавили ни одну вакансию в избранное, давайте это исправим?")}
                </p>
                <Button
                    className={styles.viewOffers}
                    color="BLUE"
                    size="SMALL"
                    variant="OUTLINE"
                    onClick={viewOffersClick}
                >
                    {t("Посмотреть вакансии")}
                </Button>
                <ReactSVG src={emptyIcon} className={styles.emptyIcon} />
            </div>
        );
    }

    return (
        <div className={cn(styles.wrapper, className)}>
            {offers.map((offer) => (
                <OfferCard
                    key={offer.id}
                    locale={locale}
                    classNameCard={styles.offerCard}
                    status={offer.status === "active" ? "opened" : "closed"}
                    data={{
                        id: offer.id,
                        title: offer.title,
                        shortDescription: offer.shortDescription,
                        imagePath: getOfferImagePath(offer.image),
                        categories: offer.categories.map((cat) => cat.name),
                        address: offer.address,
                        acceptedApplicationsCount: offer.acceptedApplicationsCount,
                        averageRating: offer.averageRating,
                        reviewsCount: offer.reviewsCount,
                    }}
                />
            ))}
        </div>
    );
};
