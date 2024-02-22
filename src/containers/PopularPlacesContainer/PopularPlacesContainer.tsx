import React, { FC } from "react";
import PopularPlaceItem from "@/containers/PopularPlacesContainer/PopularPlaceItem/PopularPlaceItem";
import { popularPlacesData } from "@/containers/PopularPlacesContainer/PopularPlaces.data";

import styles from "./PopularPlacesContainer.module.scss";

const PopularPlacesContainer: FC = () => (
    <div className={styles.wrapper}>
        {popularPlacesData
            && popularPlacesData.map((item) => (
                <PopularPlaceItem key={item.text} {...item} />
            ))}
    </div>
);

export default PopularPlacesContainer;
