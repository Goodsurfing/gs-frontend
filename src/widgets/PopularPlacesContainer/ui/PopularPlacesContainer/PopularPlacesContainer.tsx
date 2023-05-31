import React, { FC, memo } from "react";

import { popularPlacesData } from "../../model/data/PopularPlaces.data";
import { MemoPopularPlaceItem as PopularPlaceItem } from "../PopularPlaceItem/PopularPlaceItem";

import styles from "./PopularPlacesContainer.module.scss";

const PopularPlacesContainer: FC = () => (
    <div className={styles.wrapper}>
        {popularPlacesData
                && popularPlacesData.map((item, index) => <PopularPlaceItem key={index} {...item} />)}
    </div>
);

export const MemoPopularPlacesContainer = memo(PopularPlacesContainer);
