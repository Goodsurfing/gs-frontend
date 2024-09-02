import { memo } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { Request } from "../../model/types/request";

import styles from "./RequestCard.module.scss";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

interface RequestCardProps extends Request {
    className?: string;
}

export const RequestCard = memo((props: RequestCardProps) => {
    const {
        className,
        application,
        showStatus = true,
        showButtons = true,
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
                    icon={getMediaContent(application.volunteer.profile.image?.contentUrl)}
                    className={styles.image}
                    size="MEDIUM"
                />
                <div className={styles.text}>
                    <span className={styles.name}>{`${volunteer.profile.firstName} ${volunteer.profile.lastName}`}</span>
                    <span className={styles.location}>{volunteer.profile.country}</span>
                </div>
            </div>
            <div className={styles.linkWrapper}>
                {/* Make route to user profile */}
                <Link className={styles.link} to={getMainPageUrl(locale)}>
                    {vacancy.description?.title}
                </Link>
            </div>
            <div className={styles.buttons}>
                {((showButtons) && (status === "accepted")) && (
                    <>
                        <ButtonLink className={styles.button} type="outlined" path={getMainPageUrl(locale)}>{t("notes.Сообщение")}</ButtonLink>
                        <ButtonLink className={styles.button} type="outlined" path={getMainPageUrl(locale)}>{t("notes.Написать отзыв")}</ButtonLink>
                    </>
                )}
            </div>
        </div>
    );
});
