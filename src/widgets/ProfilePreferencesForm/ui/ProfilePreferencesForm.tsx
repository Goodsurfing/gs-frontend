import React, { FC } from "react";

import styles from "./ProfilePreferencesForm.module.scss";
import { Activity, PopularPlaces, SelectCountries } from "@/features/ProfilePreferences";

export const ProfilePreferencesForm:FC = () => (
    <div className={styles.wrapper}>
        <PopularPlaces />
        <SelectCountries />
        <Activity />
    </div>
);
