import React, { FC } from "react";

import styles from "./ProfilePreferencesForm.module.scss";
import {
    Activity, PopularPlaces, AcrossRussia, InputSelectedCountries,
} from "@/features/ProfilePreferences";

export const ProfilePreferencesForm:FC = () => (
    <div className={styles.wrapper}>
        <PopularPlaces />
        <AcrossRussia />
        <InputSelectedCountries />
        <Activity />
    </div>
);
