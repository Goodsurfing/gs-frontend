import React, { FC } from "react";

import styles from "./PopularPlaceItem.module.scss";

interface PopularPlaceItemProps {
    text: string;
    image: string;
}

const PopularPlaceItem: FC<PopularPlaceItemProps> = ({ text, image }) => {
    return (
        <div
            className={styles.item}
            style={{ backgroundImage: `url(${image})` }}
        >
            <p>{text}</p>
        </div>
    );
};

export default PopularPlaceItem;
