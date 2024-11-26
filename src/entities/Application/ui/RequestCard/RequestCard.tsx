import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getMainPageUrl, getOfferPersonalPageUrl, getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import { FullFormApplication } from "../../model/types/application";
import styles from "./RequestCard.module.scss";
import CustomLink from "@/shared/ui/Link/Link";
import { LinkVariant } from "@/shared/ui/Link/Link.interface";
import { Locale } from "@/entities/Locale";

interface RequestCardProps {
    className?: string;
    application: FullFormApplication;
    showStatus?: boolean;
    showButtons?: boolean;
    onReviewClick?: (application: FullFormApplication) => void;
    locale: Locale;
}

export const RequestCard = memo((props: RequestCardProps) => {
    const {
        className,
        application,
        showStatus = true,
        showButtons = true,
        onReviewClick,
        locale,
    } = props;
    const { volunteer, vacancy, status } = application;
    const { t } = useTranslation();

    const username = (!volunteer.profile.firstName && !volunteer.profile.lastName)
        ? "Анонимный пользователь" : `${volunteer.profile.firstName} ${volunteer.profile.lastName}`;

    const address = (!volunteer.profile.city || !volunteer.profile.country)
        ? "Адрес не указан" : `${volunteer.profile.country}, ${volunteer.profile.city}`;

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.cardHead}>
                {showStatus && (
                    <div className={cn(styles.notification, styles[status])}>
                        {t(`notes.${status}`)}
                    </div>
                )}
                <CustomLink
                    to={getVolunteerPersonalPageUrl(locale, volunteer.profile.id)}
                    variant={LinkVariant.DEFAULT}
                >
                    <Avatar
                        icon={getMediaContent(application.volunteer.profile.image)}
                        className={styles.image}
                        size="MEDIUM"
                    />
                </CustomLink>
                <CustomLink
                    to={getVolunteerPersonalPageUrl(locale, volunteer.profile.id)}
                    variant={LinkVariant.DEFAULT}
                >
                    <div className={styles.text}>
                        <span
                            className={styles.name}
                        >
                            {username}
                        </span>
                        <span className={styles.location}>
                            {address}
                        </span>
                    </div>
                </CustomLink>
            </div>
            <div className={styles.linkWrapper}>
                {/* Make route to user profile */}
                <Link
                    className={styles.link}
                    to={getOfferPersonalPageUrl(
                        locale,
                        vacancy.id.toString(),
                    )}
                >
                    {vacancy.description?.title}
                </Link>
            </div>
            <div className={styles.buttons}>
                {showButtons && status === "accepted" && (
                    <>
                        <ButtonLink
                            className={styles.button}
                            type="outlined"
                            path={getMainPageUrl(locale)}
                        >
                            {t("notes.Сообщение")}
                        </ButtonLink>
                        <ButtonLink
                            className={styles.button}
                            type="outlined"
                            path={getMainPageUrl(locale)}
                            onClick={() => onReviewClick?.(application)}
                        >
                            {t("notes.Написать отзыв")}
                        </ButtonLink>
                    </>
                )}
            </div>
        </div>
    );
});
