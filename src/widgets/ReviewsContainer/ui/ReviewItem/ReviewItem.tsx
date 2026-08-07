import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./ReviewItem.module.scss";

interface ReviewItemProps {
    title: string;
    text: string;
    image: string;
    author: string;
    avatar?: string;
    vacancyId: number;
}

const ReviewItem: FC<ReviewItemProps> = ({
    title,
    text,
    image,
    avatar,
    author,
    vacancyId,
}) => {
    const navigate = useNavigate();
    const { locale } = useLocale();

    const handleClick = () => {
        navigate(getOfferPersonalPageUrl(locale, String(vacancyId)));
    };

    return (
        <div className={styles.wrapper} onClick={handleClick} role="button" tabIndex={0}>
            <img src={image} alt={title} className={styles.image} loading="lazy" />
            <div className={styles.info}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.text}>{text}</p>
                <div className={styles.user}>
                    <Avatar
                        size="SMALL"
                        icon={avatar}
                        text={author}
                        alt={author}
                        className={styles.avatar}
                    />
                    <p className={styles.author}>{author}</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewItem;
