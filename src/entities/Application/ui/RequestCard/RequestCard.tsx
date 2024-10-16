import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import { FullFormApplication } from "../../model/types/application";
import styles from "./RequestCard.module.scss";

interface RequestCardProps {
    className?: string;
    application: FullFormApplication;
    showStatus?: boolean;
    showButtons?: boolean;
    onReviewClick?: (application: FullFormApplication) => void;
}

export const RequestCard = memo((props: RequestCardProps) => {
    const {
        className,
        application,
        showStatus = true,
        showButtons = true,
        onReviewClick,
    } = props;
    const { locale } = useLocale();
    const { volunteer, vacancy, status } = application;
    const { t } = useTranslation();
    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.cardHead}>
                {showStatus && (
                    <div className={cn(styles.notification, styles[status])}>
                        {t(`notes.${status}`)}
                    </div>
                )}
                <Avatar
                    icon={getMediaContent(application.volunteer.profile.image)}
                    className={styles.image}
                    size="MEDIUM"
                />
                <div className={styles.text}>
                    <span
                        className={styles.name}
                    >
                        {`${volunteer.profile.firstName} ${volunteer.profile.lastName}`}
                    </span>
                    <span className={styles.location}>
                        {volunteer.profile.country}
                    </span>
                </div>
            </div>
            <div className={styles.linkWrapper}>
                {/* Make route to user profile */}
                <Link className={styles.link} to={getMainPageUrl(locale)}>
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
