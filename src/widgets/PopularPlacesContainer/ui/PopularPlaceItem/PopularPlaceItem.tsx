import React, { FC } from "react";

import styles from "./PopularPlaceItem.module.scss";

interface PopularPlaceItemProps {
    text: string;
    image: string;
    dataAos?: string;
}

const PopularPlaceItem: FC<PopularPlaceItemProps> = ({ text, image, dataAos }) => (
    <div
        className={styles.item}
        style={{ backgroundImage: `url(${image})` }}
        data-aos={dataAos}
    >
        <p>{text}</p>
    </div>
);

export default PopularPlaceItem;
