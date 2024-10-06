import React, { FC } from "react";

import {
    AcrossRussia,
    Activity,
    PopularPlaces,
} from "@/features/ProfilePreferences";

import styles from "./ProfilePreferencesForm.module.scss";

export const ProfilePreferencesForm: FC = () => (
    <div className={styles.wrapper}>
        <PopularPlaces />
        <AcrossRussia />
        {/* <InputSelectedCountries /> */}
        <Activity />
    </div>
);
