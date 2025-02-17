import React, { FC } from "react";

import {
    Activity,
} from "@/features/ProfilePreferences";

import styles from "./ProfilePreferencesForm.module.scss";

export const ProfilePreferencesForm: FC = () => (
    <div className={styles.wrapper}>
        {/* Functionality cut out */}
        {/* <PopularPlaces /> */}
        {/* <AcrossRussia /> */}
        {/* <InputSelectedCountries /> */}
        <Activity />
    </div>
);
