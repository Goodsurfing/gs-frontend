import cn from "classnames";
import { memo } from "react";

import {
    getVolunteerPersonalPageUrl,
} from "@/shared/config/routes/AppUrls";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import CustomLink from "@/shared/ui/Link/Link";
import { Locale } from "@/entities/Locale";
import { getFullAddress, useGetFullName } from "@/shared/lib/getFullName";
import { useApplicationStatus } from "@/shared/hooks/useApplicationStatus";
import styles from "./MiniVolunteerReview.module.scss";
import { FormApplicationStatus } from "@/entities/Application";

interface MiniVolunteerReviewProps {
    className?: string;
    data: {
        volunteerId: string;
        firstName: string | null;
        lastName: string | null;
        applicationStatus: FormApplicationStatus;
        image?: string;
        country: string | null;
        city: string | null;
    };
    locale: Locale;
}

export const MiniVolunteerReview = memo((props: MiniVolunteerReviewProps) => {
    const {
        className,
        data,
        locale,
    } = props;
    const {
        volunteerId, firstName, lastName, image, city, country,
        applicationStatus,
    } = data;
    const { getApplicationStatus } = useApplicationStatus();

    const { getFullName } = useGetFullName();
    const userName = getFullName(firstName, lastName);
    const fullAddress = getFullAddress(city, country);

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.cardHead}>
                <div className={cn(styles.notification, styles[applicationStatus])}>
                    {getApplicationStatus(applicationStatus)}
                </div>
                <CustomLink
                    to={getVolunteerPersonalPageUrl(locale, volunteerId)}
                    variant="DEFAULT"
                >
                    <Avatar
                        icon={image}
                        className={styles.image}
                        size="MEDIUM"
                    />
                </CustomLink>
                <CustomLink
                    to={getVolunteerPersonalPageUrl(locale, volunteerId)}
                    variant="DEFAULT"
                >
                    <div className={styles.text}>
                        <span
                            className={styles.name}
                        >
                            {userName}
                        </span>
                        <span className={styles.location}>
                            {fullAddress}
                        </span>
                    </div>
                </CustomLink>
            </div>
        </div>
    );
});
