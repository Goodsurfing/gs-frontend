import React, { FC } from "react";

import PopularPlaceItem from "widgets/PopularPlacesContainer/PopularPlaceItem/PopularPlaceItem";
import { popularPlacesData } from "widgets/PopularPlacesContainer/PopularPlaces.data";

import styles from "./PopularPlacesContainer.module.scss";

const PopularPlacesContainer: FC = () => (
    <div className={styles.wrapper}>
        {popularPlacesData
                && popularPlacesData.map((item, index) => <PopularPlaceItem key={index} {...item} />)}
    </div>
);

export default PopularPlacesContainer;
