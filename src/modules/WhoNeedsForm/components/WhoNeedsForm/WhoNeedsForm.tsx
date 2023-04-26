import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";
import React from "react";

import Age from "../Age/Age";
import Gender from "../Gender/Gender";
import LanguagesGroup from "../LanguagesGroup/LanguagesGroup";
import styles from "./WhoNeedsForm.module.scss";

export const WhoNeedsForm = () => {
    return (
        <form className={styles.wrapper}>
            <Gender />
            <Age />
            <LanguagesGroup />
            <Button
                onClick={() => {}}
                className={styles.btn}
                rounded
                variant={Variant.PRIMARY}
            >
                Сохранить
            </Button>
        </form>
    );
};
