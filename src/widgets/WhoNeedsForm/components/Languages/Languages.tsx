import React, { FC } from "react";

import SelectField from "components/SelectField/SelectField";

import { allLangs, langsLevels } from "./Languages.data";
import styles from "./Languages.module.scss";
import { LanguagesProps } from "./types";

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
