import React, { FC } from "react";

import { LanguagesProps } from "./types";

import { allLangs, langsLevels } from "./Languages.data";

import SelectField from "@/components/SelectField/SelectField";

import styles from "./Languages.module.scss";

const Languages: FC<LanguagesProps> = ({ close }) => (
    <div className={styles.wrapper}>
        <SelectField
            className={styles.all}
            name="allLangs"
            label="Знание языков"
            options={allLangs}
        />
        <SelectField
            className={styles.levels}
            name="langLevels"
            label="Уровень владения"
            options={langsLevels}
        />
        {close}
    </div>
);

export default Languages;
