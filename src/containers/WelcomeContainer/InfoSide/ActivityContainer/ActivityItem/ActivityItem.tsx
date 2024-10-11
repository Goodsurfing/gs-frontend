import React, { FC } from "react";
import { Link } from "react-router-dom";

import cn from "classnames";
import styles from "./ActivityItem.module.scss";

interface ActivityItemProps {
    title: string;
    image: string;
    path: string;
    className?: string;
}

const ActivityItem: FC<ActivityItemProps> = ({
    path, title, image, className,
}) => (
    <Link
        className={cn(styles.item, className)}
        to={path}
        style={{ backgroundImage: `url(${image})` }}
    >
        <p>{title}</p>
    </Link>
);

export default ActivityItem;
