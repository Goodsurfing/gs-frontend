import { memo } from "react";

import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";

import Age from "../Age/Age";
import Gender from "../Gender/Gender";
import LanguagesGroup from "../LanguagesGroup/LanguagesGroup";
import Location from "../Location/Location";

import styles from "./WhoNeedsForm.module.scss";

export const WhoNeedsForm = memo(() => (
    <form className={styles.wrapper}>
        <Gender />
        <Age />
        <LanguagesGroup />
        <Location />
        <Button
            onClick={() => {}}
            className={styles.btn}
            rounded
            variant={Variant.PRIMARY}
        >
            Сохранить
        </Button>
    </form>
));
