import React, { FC } from "react";
import cn from "classnames";
import { Locale } from "@/entities/Locale";
import CustomLink from "@/shared/ui/Link/Link";
import { useApplicationStatus } from "@/shared/hooks/useApplicationStatus";

import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useCategories } from "@/shared/data/categories";
import { textSlice } from "@/shared/lib/textSlice";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import styles from "./MiniOfferReview.module.scss";
import { FormApplicationStatus } from "@/entities/Application";

interface MiniOfferReviewProps {
    className?: string;
    locale: Locale;
    data: {
        offerId: number;
        address: string | null;
        name: string | null;
        image?: string;
        applicationStatus: FormApplicationStatus;
        categoryName: string;
    }
}

export const MiniOfferReview: FC<MiniOfferReviewProps> = (props) => {
    const { className, data, locale } = props;
    const {
        offerId, image, name, applicationStatus, address,
        categoryName,
    } = data;
    const { getTranslation } = useCategories();
    const { getApplicationStatus } = useApplicationStatus();

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={cn(styles.status, styles[applicationStatus])}>
                {getApplicationStatus(applicationStatus)}
            </div>
            <CustomLink to={getOfferPersonalPageUrl(locale, offerId.toString())} variant="DEFAULT">
                <div className={styles.mainInfo}>
                    <Avatar
                        icon={image}
                        alt="offer title image"
                        className={styles.avatar}
                    />
                    <div className={styles.infoContainer}>
                        <span className={styles.title}>
                            {textSlice(
                                name,
                                45,
                                "title",
                            )}
                        </span>
                        <span className={styles.address}>
                            {textSlice(
                                address,
                                23,
                                "address",
                            )}
                        </span>
                        <span className={styles.tag}>
                            {getTranslation(categoryName)}
                        </span>
                    </div>
                </div>
            </CustomLink>
        </div>
    );
};
