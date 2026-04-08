import cn from "classnames";
import { ReactNode, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import flagIcon from "@/shared/assets/icons/donation/flag.svg";
import calendarIcon from "@/shared/assets/icons/donation/calendar.svg";
import checkIcon from "@/shared/assets/icons/donation/check.svg";
import {
    getDonationPayPageUrl,
    getDonationPersonalPage,
    getProfileRolePageUrl,
    getSignInPageUrl,
} from "@/shared/config/routes/AppUrls";
import Button, { ButtonSize, ButtonColor, ButtonVariant } from "@/shared/ui/Button/Button";
import IconComponent from "@/shared/ui/IconComponent/IconComponent";

import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";
import { textSlice } from "@/shared/lib/textSlice";
import { DonationStatus as DonationStatusType } from "../../model/types/donationSchema";
import styles from "./HeaderDonationCard.module.scss";
import { DonationStatus } from "../DonationStatus/DonationStatus";

interface HeaderDonationCardProps {
    donationId: string;
    className?: string;
    title?: string | null;
    image?: string;
    categories?: ReactNode;
    location?: string;
    peopleSupportCount: number;
    percentAmountCollect: number;
    daysLeft: number;
    isSuccess: boolean;
    imageBlock?: ReactNode;
    canEdit: boolean;
    canSupport: boolean;
    status: DonationStatusType;
    isVolunteer: boolean;
}

export const HeaderDonationCard = memo((props: HeaderDonationCardProps) => {
    const {
        donationId,
        className,
        categories,
        imageBlock,
        title,
        location,
        image,
        canEdit,
        canSupport,
        status,
        isVolunteer,
        isSuccess,
        daysLeft,
        peopleSupportCount,
        percentAmountCollect,
    } = props;
    const { t } = useTranslation("donation");
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
            navigate(`${getProfileRolePageUrl(locale)}?nextDonation=${donationId}`);
        } else if (isAuth) {
            navigate(getDonationPayPageUrl(locale, donationId));
        } else {
            navigate(`${getSignInPageUrl(locale)}?next=donation&nextId=${donationId}`);
        }
    }, [isNeedToBecomeVolunteer, isAuth, navigate, locale, donationId]);

    const handleEditClick = useCallback(() => {
        if (canEdit) {
            navigate(getDonationPersonalPage(locale, donationId));
        }
    }, [canEdit, donationId, locale, navigate]);

    const getButtonText = (): string => {
        if (isNeedToBecomeVolunteer) {
            return t("donationPersonal.Чтобы участвовать, станьте гудсёрфером");
        }

        return t("donationPersonal.Поддержать");
    };

    const buttonProps = {
        size: "SMALL" as ButtonSize,
        variant: "FILL" as ButtonVariant,
        color: "BLUE" as ButtonColor,
        onClick: handleParticipateClick,
        // disabled: isNeedToBecomeVolunteer ? false : !canParticipate,
        disabled: isAuth && !isNeedToBecomeVolunteer && !canSupport,
    };

    const buttonText = getButtonText();

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
                        <DonationStatus status={status} />
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
                                {t("donationPersonal.Людей поддержало")}
                                :
                                {" "}
                                {peopleSupportCount}
                            </p>
                            {isSuccess ? (
                                <div className={styles.stats}>
                                    <IconComponent
                                        className={styles.icon}
                                        icon={checkIcon}
                                    />
                                    <span
                                        className={cn(styles.ratingText, {
                                            [styles.black]: !isImage,
                                        })}
                                    >
                                        {t("donationPersonal.Проект собрал")}
                                        {" "}
                                        {percentAmountCollect}
                                        {" "}
                                        %
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.stats}>
                                        <IconComponent
                                            className={styles.icon}
                                            icon={flagIcon}
                                        />
                                        <span
                                            className={cn(styles.ratingText, {
                                                [styles.black]: !isImage,
                                            })}
                                        >
                                            {t("donationPersonal.Средств собрано")}
                                            {" "}
                                            {percentAmountCollect}
                                            {" "}
                                            %
                                        </span>
                                    </div>
                                    <div className={styles.stats}>
                                        <IconComponent
                                            className={styles.icon}
                                            icon={calendarIcon}
                                        />
                                        <span
                                            className={cn(styles.ratingText, {
                                                [styles.black]: !isImage,
                                            })}
                                        >
                                            {t("donationPersonal.Дней осталось")}
                                            {" "}
                                            {daysLeft}
                                        </span>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                    <div className={styles.botPart}>{imageBlock}</div>
                </div>
                <div className={styles.right}>
                    <Button {...buttonProps}>
                        {buttonText}
                    </Button>
                    {canEdit && (
                        <Button
                            size="SMALL"
                            variant="FILL"
                            color="BLUE"
                            onClick={handleEditClick}
                        >
                            {t("donationPersonal.Редактировать")}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
});
