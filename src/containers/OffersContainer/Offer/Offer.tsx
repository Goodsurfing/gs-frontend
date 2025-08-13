import React, { FC } from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";

import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

import { Offer as OfferType } from "@/entities/Offer";

import starIcon from "@/shared/assets/icons/star.svg";
import defaultImage from "@/shared/assets/images/default-offer-image.svg";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useCategories } from "@/shared/data/categories";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { textSlice } from "@/shared/lib/textSlice";

import styles from "./Offer.module.scss";

interface OfferProps {
    offer: OfferType;
    locale: Locale;
}

const Offer: FC<OfferProps> = (props) => {
    const { offer, locale } = props;
    const {
        id,
        description,
        where,
        acceptedApplicationsCount,
        averageRating,
        feedbacksCount,
    } = offer;
    const { getTranslation } = useCategories();

    const image = description?.image;
    const category = getTranslation(description?.categoryIds[0]) ?? "Без категории";

    return (
        <Link to={getOfferPersonalPageUrl(locale, id.toString())} className={styles.item}>
            <img
                src={image ? getMediaContent(image) : defaultImage}
                className={styles.image}
                alt={description?.title}
            />
            <div className={styles.content}>
                <h4 className={styles.title}>
                    {textSlice(description?.title, 30, "title")}
                </h4>
                <p className={styles.location}>
                    {textSlice(where?.address, 30, "address")}
                </p>
                <p className={styles.type}>{category}</p>
            </div>
            <div className={styles.info}>
                {averageRating ? (
                    <div className={styles.rating}>
                        <ReactSVG src={starIcon} />
                        <span>{averageRating}</span>
                    </div>
                ) : null}
                {feedbacksCount ? (
                    <div className={styles.reviews}>

                        <span>
                            Отзывов:
                            {" "}
                            {feedbacksCount}
                        </span>
                    </div>
                ): null}
                <div className={styles.success}>
                    <span>
                        Отправилось:
                        {" "}
                        {acceptedApplicationsCount}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default Offer;
