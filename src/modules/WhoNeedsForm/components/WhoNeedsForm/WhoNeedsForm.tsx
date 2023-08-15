import { memo } from "react";

import Button from "@/shared/ui/Button/Button";

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

            variant="FILL"
            color="BLUE"
            size="MEDIUM"
        >
            Сохранить
        </Button>
    </form>
));
