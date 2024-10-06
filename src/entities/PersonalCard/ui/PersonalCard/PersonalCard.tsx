import { memo, ReactNode, useCallback } from "react";

import cn from "classnames";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import star from "@/shared/assets/icons/star.svg";

import styles from "./PersonalCard.module.scss";
import Button from "@/shared/ui/Button/Button";
import IconComponent from "@/shared/ui/IconComponent/IconComponent";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getMessengerPageCreateUrl } from "@/shared/config/routes/AppUrls";

interface PersonalCardProps {
    offerId: string;
    className?: string;
    title?: string;
    image?: string;
    categories?: ReactNode; // todo: backend & entity
    rating?: number;
    location?: string;
    imageBlock?: ReactNode;
    medals?: ReactNode;
}

export const PersonalCard = memo((props: PersonalCardProps) => {
    const {
        offerId,
        className,
        categories,
        rating,
        imageBlock,
        title,
        location,
        image,
        medals,
    } = props;
    const { t } = useTranslation("offer");
    const isImage = image !== undefined;
    const backgroundImageStyle = isImage
        ? {
            background: `
            linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%,
            rgba(0, 0, 0, 0.50) 100%),
            lightgray 50% / cover no-repeat
            url(${image})`,
        }
        : { background: "#ECF1F4" };
    const { locale } = useLocale();
    const navigate = useNavigate();

    const handleParticipateClick = useCallback(() => {
        navigate(getMessengerPageCreateUrl(locale, "create", offerId));
    }, [locale, navigate, offerId]);

    return (
        <div className={cn(className, styles.wrapper)}>
            <div
                className={styles.backgroundImage}
                style={backgroundImageStyle}
            />
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.topPart}>
                        <h1 className={cn(
                            styles.title,
                            { [styles.black]: !isImage },
                        )}
                        >
                            {title}
                        </h1>
                        <div className={styles.info}>
                            {categories}
                            <span className={cn(
                                styles.location,
                                { [styles.black]: !isImage },
                            )}
                            >
                                {location}
                            </span>
                            <div className={styles.rating}>
                                <IconComponent className={styles.star} icon={star} />
                                <span className={cn(
                                    styles.ratingText,
                                    { [styles.black]: !isImage },
                                )}
                                >
                                    {rating}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.botPart}>
                        {imageBlock}
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.medals}>
                        {medals}
                        MEDALS
                    </div>
                    <Button size="SMALL" variant="FILL" color="BLUE" onClick={handleParticipateClick}>
                        {t("personalOffer.Участвовать")}
                    </Button>
                </div>
            </div>
        </div>
    );
});
