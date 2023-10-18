import React, { FC } from "react";

import styles from "./SelectCountries.module.scss";

interface SelectCountriesProps {

}

export const SelectCountries:FC<SelectCountriesProps> = () => (
    <div className={styles.wrapper}>
        <h3>Популярные места</h3>
        <div className={styles.container} />
    </div>
);
