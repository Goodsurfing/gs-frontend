import React, { FC, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import PopularPlaceItem from "@/containers/PopularPlacesContainer/PopularPlaceItem/PopularPlaceItem";
import { popularPlacesData } from "@/containers/PopularPlacesContainer/PopularPlaces.data";

import styles from "./PopularPlacesContainer.module.scss";

const PopularPlacesContainer: FC = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        return () => {
            AOS.refreshHard();
        };
    }, []);

    return (
        <div className={styles.wrapper}>
            {popularPlacesData
            && popularPlacesData.map((item, index) => (
                <PopularPlaceItem key={item.text} dataAos={index % 2 === 0 ? "flip-left" : "flip-right"} {...item} />
            ))}
        </div>
    );
};

export default PopularPlacesContainer;
