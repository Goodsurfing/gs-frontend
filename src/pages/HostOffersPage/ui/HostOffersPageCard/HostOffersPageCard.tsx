import { memo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button/Button";

import like from "@/shared/assets/icons/offers/like.svg";
import star from "@/shared/assets/icons/offers/star.svg";

import styles from "./HostOffersPageCard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getOffersWherePageUrl } from "@/shared/config/routes/AppUrls";

interface IHostOffersPageCard {
    id: string;
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

const HostOffersPageCard = memo(({
    id,
    image,
    title,
    location,
    category,
    rating,
    likes,
    reviews,
    went,
    description,
}: IHostOffersPageCard) => {
    const navigate = useNavigate();
    const { locale } = useLocale();
    const onEditClick = () => {
        navigate(getOffersWherePageUrl(locale));
    };
    return (
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
                            {" "}
                            {reviews}
                        </span>
                        <span className={styles.went}>
                            Отправились:
                            {" "}
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
                    variant="FILL"
                    color="GREEN"
                    size="SMALL"
                    onClick={onEditClick}
                >
                    Редактировать
                </Button>
                <Button
                    color="GRAY"
                    variant="OUTLINE"
                    size="SMALL"
                    className={styles.gray}
                >
                    Закрыть
                </Button>
                <Button
                    className={styles.black}
                    variant="FILL"
                    color="BLACK"
                    size="SMALL"
                >
                    Стать «всегда открытым»
                </Button>
            </div>
        </div>
    );
});

export default HostOffersPageCard;
