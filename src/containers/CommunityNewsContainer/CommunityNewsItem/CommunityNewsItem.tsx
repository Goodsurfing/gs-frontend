import React, { FC } from "react";

import CustomLink from "@/shared/ui/Link/Link";
import { getBlogPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import styles from "./CommunityNewsItem.module.scss";

interface CommunityNewsItemProps {
    id: string;
    title: string;
    date: string;
    image?: string;
    locale: Locale;
}

const CommunityNewsItem: FC<CommunityNewsItemProps> = ({
    id,
    title,
    date,
    image,
    locale,
}) => (
    <CustomLink
        to={getBlogPersonalPageUrl(locale, id)}
        variant="DEFAULT"
        className={styles.wrapper}
    >
        {image ? <img src={image} alt={title} className={styles.image} />
            : <div className={styles.noImage} />}
        <p className={styles.date}>{date}</p>
        <h3 className={styles.title} title={title}>{title}</h3>
    </CustomLink>
);

export default CommunityNewsItem;
