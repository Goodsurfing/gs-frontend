import React, { FC } from "react";
import { Link } from "react-router-dom";

import styles from "./ActivityItem.module.scss";

interface ActivityItemProps {
    title: string;
    image: string;
    path: string;
}

const ActivityItem: FC<ActivityItemProps> = ({ path, title, image }) => (
    <Link
        className={styles.item}
        to={path}
        style={{ backgroundImage: `url(${image})` }}
    >
        <p>{title}</p>
    </Link>
);

export default ActivityItem;
