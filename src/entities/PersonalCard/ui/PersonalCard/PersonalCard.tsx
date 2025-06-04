import cn from "classnames";
import { ReactNode, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { OfferStatus as OfferStatusType } from "@/entities/Offer";

import star from "@/shared/assets/icons/star.svg";
import {
    getMessengerPageCreateUrl,
    getOffersWherePageUrl,
} from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";
import IconComponent from "@/shared/ui/IconComponent/IconComponent";
import { OfferStatus } from "@/shared/ui/OfferStatus/OfferStatus";

import styles from "./PersonalCard.module.scss";

interface PersonalCardProps {
    offerId: string;
    className?: string;
    title?: string;
    image?: string;
    categories?: ReactNode; // todo: backend & entity
    rating?: number;
    location?: string;
    imageBlock?: ReactNode;
    canEdit: boolean;
    canParticipate: boolean;
    status: OfferStatusType;
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
        canEdit,
        canParticipate,
        status,
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

    const handleEditClick = useCallback(() => {
        if (canEdit) {
            navigate(getOffersWherePageUrl(locale, offerId));
        }
    }, [canEdit, locale, navigate, offerId]);

    return (
        <div className={cn(className, styles.wrapper)}>
            <div
                className={styles.backgroundImage}
                style={backgroundImageStyle}
            />
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.topPart}>
                        <h1
                            className={cn(styles.title, {
                                [styles.black]: !isImage,
                            })}
                        >
                            {title}
                        </h1>
                        <OfferStatus status={status} />
                        <div className={styles.info}>
                            {categories}
                            <span
                                className={cn(styles.location, {
                                    [styles.black]: !isImage,
                                })}
                            >
                                {location}
                            </span>
                            {rating && (
                                <div className={styles.rating}>
                                    <IconComponent
                                        className={styles.star}
                                        icon={star}
                                    />
                                    <span
                                        className={cn(styles.ratingText, {
                                            [styles.black]: !isImage,
                                        })}
                                    >
                                        {rating}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.botPart}>{imageBlock}</div>
                </div>
                <div className={styles.right}>
                    {/* <div className={styles.medals}>
                        {medals}
                    </div> */}
                    <Button
                        disabled={!canParticipate}
                        size="SMALL"
                        variant="FILL"
                        color="BLUE"
                        onClick={handleParticipateClick}
                    >
                        {t("personalOffer.Участвовать")}
                    </Button>
                    {canEdit && (
                        <Button
                            size="SMALL"
                            variant="FILL"
                            color="BLUE"
                            onClick={handleEditClick}
                        >
                            {t("personalOffer.Редактировать")}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
});
