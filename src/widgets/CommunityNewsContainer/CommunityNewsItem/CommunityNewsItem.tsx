import React, { FC } from "react";

import styles from "./CommunityNewsItem.module.scss";

interface CommunityNewsItemProps {
    title: string;
    date: string;
    image: string;
}

const CommunityNewsItem: FC<CommunityNewsItemProps> = ({
  title,
  date,
  image,
}) => (
    <div className={styles.wrapper}>
        <img src={image} alt={title} className={styles.image} />
        <p className={styles.date}>{date}</p>
        <h3 className={styles.title}>{title}</h3>
    </div>
);

export default CommunityNewsItem;
