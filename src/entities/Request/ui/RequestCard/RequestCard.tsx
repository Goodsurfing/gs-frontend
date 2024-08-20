import { memo } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";

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
    } = props;
    const { locale } = useLocale();
    const { volunteer, vacancy, status } = application;
    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.cardHead}>
                <div className={cn(styles.notification, styles[status])}>
                    {status}
                </div>
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
                <ButtonLink className={styles.button} type="outlined" path={getMainPageUrl(locale)}>Сообщение</ButtonLink>
                <ButtonLink className={styles.button} type="outlined" path={getMainPageUrl(locale)}>Написать отзыв</ButtonLink>
            </div>
        </div>
    );
});
