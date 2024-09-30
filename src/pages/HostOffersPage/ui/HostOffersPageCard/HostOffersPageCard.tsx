import { MouseEventHandler, memo } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";
import defaultImage from "@/shared/assets/images/default-offer-image.svg";

import like from "@/shared/assets/icons/offers/like.svg";
import star from "@/shared/assets/icons/offers/star.svg";
import Button from "@/shared/ui/Button/Button";
import { OfferStatus } from "@/entities/Offer";
import { textSlice } from "@/shared/lib/textSlice";
import styles from "./HostOffersPageCard.module.scss";

interface IHostOffersPageCard {
    id: number;
    image?: string;
    title?: string;
    location?: string;
    category?: string;
    rating: string;
    likes: string;
    reviews: string;
    went: string;
    description?: string;
    status: OfferStatus;
    onCloseClick: MouseEventHandler<HTMLButtonElement>;
    isCloseButtonActive: boolean;
    onEveryOpenClick: MouseEventHandler<HTMLButtonElement>;
    isEveryOpenActive: boolean;
}

const HostOffersPageCard = memo(
    ({
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
        status,
        onCloseClick,
        isCloseButtonActive,
        isEveryOpenActive,
        onEveryOpenClick,
    }: IHostOffersPageCard) => {
        const navigate = useNavigate();
        const { locale } = useLocale();

        const onEditClick = () => {
            if (status === "draft") {
                navigate(`/${locale}/offers/welcome/${id}`);
            } else {
                navigate(`/${locale}/offers/where/${id}`);
            }
        };

        return (
            <div className={styles.cardWrapper}>
                <Link to={`/${locale}/offer-personal/${id}`} className={styles.cardInner}>
                    <div className={styles.imageWrapper}>
                        <img src={image || defaultImage} alt="travel-img" />
                    </div>
                    <div className={styles.content}>
                        <p className={styles.title}>
                            {textSlice(title, 34, "title")}
                        </p>
                        <div className={styles.subtitle}>
                            <span className={styles.location}>
                                {textSlice(location, 34, "address")}
                            </span>
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
                            {textSlice(description, 110, "description")}
                        </p>
                    </div>
                </Link>
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
                        onClick={onCloseClick}
                    >
                        {isCloseButtonActive ? "Закрыть" : "Открыть"}
                    </Button>
                    <Button
                        className={styles.black}
                        variant={isEveryOpenActive ? "FILL" : "OUTLINE"}
                        color="BLACK"
                        size="SMALL"
                        onClick={onEveryOpenClick}
                    >
                        Стать «всегда открытым»
                    </Button>
                </div>
            </div>
        );
    },
);

export default HostOffersPageCard;
