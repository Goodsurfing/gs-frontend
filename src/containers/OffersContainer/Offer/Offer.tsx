import React, { FC } from "react";

import { ReactSVG } from "react-svg";
import starIcon from "@/shared/assets/icons/star.svg";

import styles from "./Offer.module.scss";
import { Offer as OfferType } from "@/entities/Offer";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useCategories } from "@/shared/data/categories";

interface OfferProps {
    offer: OfferType;
}

const Offer: FC<OfferProps> = (props) => {
    const { offer } = props;
    const { description, where } = offer;
    const { getTranslation } = useCategories();

    const image = description?.image;
    const title = description?.title ?? "Без заголовка";
    const category = getTranslation(description?.categoryIds[0]) ?? "Без категории";
    const location = where?.address ?? "Без адреса";

    return (
        <div className={styles.item}>
            <img src={getMediaContent(image)} className={styles.image} alt={title} />
            <div className={styles.content}>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.location}>{location}</p>
                <p className={styles.type}>{category}</p>
            </div>
            <div className={styles.info}>
                <div className={styles.rating}>
                    <ReactSVG src={starIcon} />
                    <span>{5}</span>
                </div>
                <div className={styles.reviews}>
                    <span>
                        Отзывов:
                        {" "}
                        {5}
                    </span>
                </div>
                <div className={styles.success}>
                    <span>
                        Отправилось:
                        {" "}
                        {5}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Offer;
