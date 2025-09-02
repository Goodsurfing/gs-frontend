import React, { FC } from "react";
import { Link } from "react-router-dom";

import cn from "classnames";
import styles from "./ActivityItem.module.scss";
import { Locale } from "@/entities/Locale";

interface ActivityItemProps {
    title: string;
    image: string;
    path: string;
    className?: string;
    locale: Locale;
}

const ActivityItem: FC<ActivityItemProps> = ({
    path, title, image, className, locale,
}) => (
    <Link
        className={cn(styles.item, className)}
        to={path}
        style={{ backgroundImage: `url(${image})` }}
    >
        <p lang={locale}>{title}</p>
    </Link>
);

export default ActivityItem;
