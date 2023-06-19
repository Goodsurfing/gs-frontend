import React, { FC } from 'react';

import Button from 'components/ui/Button/Button';
import { Variant } from 'components/ui/Button/Button.interface';

import like from 'assets/icons/offers/like.svg';
import star from 'assets/icons/offers/star.svg';

import styles from './HostOffersPageCard.module.scss';

interface IHostOffersPageCard {
    image: string;
    title: string;
    location: string;
    category: string;
    rating: string;
    likes: string;
    reviews: string;
    went: string;
    description: string;
}

const HostOffersPageCard: FC<IHostOffersPageCard> = ({
  image,
  title,
  location,
  category,
  rating,
  likes,
  reviews,
  went,
  description,
}) => (
    <div className={styles.cardWrapper}>
        <div className={styles.imageWrapper}>
            <img src={image} alt="travel-img" />
        </div>
        <div className={styles.content}>
            <p className={styles.title}>
                {title.length > 36 ? `${title.slice(0, 36)}..` : title}
            </p>
            <div className={styles.subtitle}>
                <span className={styles.location}>{location}</span>
                <span className={styles.category}>{category}</span>
            </div>
            <div className={styles.stats}>
                <div className={styles.rating}>
                    <img src={star} alt="star-icon" />
                    <span>{rating}</span>
                </div>
                <div className={styles.likes}>
                    <img src={like} alt="heart-icon" />
                    <span>{likes}</span>
                </div>
                <div className={styles.extraInfo}>
                    <span className={styles.review}>
                        Отзывов:
                        {' '}
                        {reviews}
                    </span>
                    <span className={styles.went}>
                        Отправились:
                        {went}
                    </span>
                </div>
            </div>
            <p className={styles.description}>
                {description.length > 110
                  ? `${description.slice(0, 109)}..`
                  : description}
            </p>
        </div>
        <div className={styles.btns}>
            <Button
                className={styles.green}
                variant={Variant.GREEN}
                rounded
            >
                Редактировать
            </Button>
            <Button className={styles.gray} variant={Variant.GRAY} rounded>
                Закрыть
            </Button>
            <Button
                className={styles.black}
                variant={Variant.BLACK}
                rounded
            >
                Стать «всегда открытым»
            </Button>
        </div>
    </div>
);

export default HostOffersPageCard;
