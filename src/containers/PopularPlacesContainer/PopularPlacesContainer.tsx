import React, { FC } from "react";

import PopularPlaceItem from "@/containers/PopularPlacesContainer/PopularPlaceItem/PopularPlaceItem";
import { popularPlacesData } from "@/containers/PopularPlacesContainer/PopularPlaces.data";

import styles from "./PopularPlacesContainer.module.scss";

const PopularPlacesContainer: FC = () => {
    return (
        <div className={styles.wrapper}>
            {popularPlacesData
                && popularPlacesData.map((item, index) => {
                    return <PopularPlaceItem key={index} {...item} />;
                })}
        </div>
    );
};

export default PopularPlacesContainer;
