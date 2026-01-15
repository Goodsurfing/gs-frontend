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
    getProfileRolePageUrl,
    getSignInPageUrl,
} from "@/shared/config/routes/AppUrls";
import Button, { ButtonSize, ButtonColor, ButtonVariant } from "@/shared/ui/Button/Button";
import IconComponent from "@/shared/ui/IconComponent/IconComponent";
import { OfferStatus } from "@/shared/ui/OfferStatus/OfferStatus";

import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";
import { textSlice } from "@/shared/lib/textSlice";
import styles from "./PersonalCard.module.scss";

interface PersonalCardProps {
    offerId: string;
    className?: string;
    title?: string;
    image?: string;
    categories?: ReactNode; // todo: backend & entity
    reviewsCount: number;
    rating: number;
    location?: string;
    imageBlock?: ReactNode;
    canEdit: boolean;
    canParticipate: boolean;
    status: OfferStatusType;
    isVolunteer: boolean;
}

export const PersonalCard = memo((props: PersonalCardProps) => {
    const {
        offerId,
        className,
        categories,
        reviewsCount,
        rating,
        imageBlock,
        title,
        location,
        image,
        canEdit,
        canParticipate,
        status,
        isVolunteer,
    } = props;
    const { t } = useTranslation("offer");
    const isAuth = useAppSelector(getUserAuthData);
    const isNeedToBecomeVolunteer = !!isAuth && !isVolunteer;

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
        if (isNeedToBecomeVolunteer) {
            navigate(`${getProfileRolePageUrl(locale)}?next=${offerId}`);
        } else if (isAuth) {
            navigate(getMessengerPageCreateUrl(locale, "create", offerId));
        } else {
            navigate(`${getSignInPageUrl(locale)}?next=offer&nextId=${offerId}`);
        }
    }, [locale, navigate, offerId, isNeedToBecomeVolunteer, isAuth]);

    const handleEditClick = useCallback(() => {
        if (canEdit) {
            navigate(getOffersWherePageUrl(locale, offerId));
        }
    }, [canEdit, locale, navigate, offerId]);

    const buttonProps = {
        size: "SMALL" as ButtonSize,
        variant: "FILL" as ButtonVariant,
        color: "BLUE" as ButtonColor,
        onClick: handleParticipateClick,
        // disabled: isNeedToBecomeVolunteer ? false : !canParticipate,
        disabled: isAuth && !isNeedToBecomeVolunteer && !canParticipate,
    };

    const buttonText = isNeedToBecomeVolunteer
        ? t("personalOffer.Чтобы участвовать, станьте гудсёрфером")
        : t("personalOffer.Участвовать");

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
                            {textSlice(title, 220, "title")}
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
                            <p className={cn(styles.reviewsCount, {
                                [styles.black]: !isImage,
                            })}
                            >
                                Кол-во отзывов:
                                {" "}
                                {reviewsCount}
                            </p>
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
                        </div>
                    </div>
                    <div className={styles.botPart}>{imageBlock}</div>
                </div>
                <div className={styles.right}>
                    {/* <div className={styles.medals}>
                        {medals}
                    </div> */}
                    <Button {...buttonProps}>
                        {buttonText}
                    </Button>
                    {/* {(!!isAuth && !isVolunteer) ? (
                        <Button
                            size="SMALL"
                            variant="FILL"
                            color="BLUE"
                            onClick={handleRoleClick}
                        >
                            {t("personalOffer.Чтобы участвовать, станьте гудсёрфером")}
                        </Button>
                    )
                        : (
                            <Button
                                disabled={!canParticipate}
                                size="SMALL"
                                variant="FILL"
                                color="BLUE"
                                onClick={handleParticipateClick}
                            >
                                {t("personalOffer.Участвовать")}
                            </Button>
                        )} */}
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
