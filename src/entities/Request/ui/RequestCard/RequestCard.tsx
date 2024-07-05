import { memo } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { Request } from "../../model/types/request";

import styles from "./RequestCard.module.scss";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

interface RequestCardProps extends Request {
    className?: string;
}

export const RequestCard = memo((props: RequestCardProps) => {
    const {
        className,
        article,
        notificationType,
        user,
    } = props;
    const { locale } = useLocale();
    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.cardHead}>
                <div className={cn(styles.notification, styles[notificationType])}>
                    {notificationType}
                </div>
                <Avatar
                    icon={user?.image?.contentUrl}
                    className={styles.image}
                    size="MEDIUM"
                />
                <div className={styles.text}>
                    <span className={styles.name}>{user?.firstName}</span>
                    <span className={styles.location}>{user?.country}</span>
                </div>
            </div>
            <div className={styles.linkWrapper}>
                {/* Make route to user profile */}
                <Link className={styles.link} to={getMainPageUrl(locale)}>
                    {article}
                </Link>
            </div>
        </div>
    );
});
