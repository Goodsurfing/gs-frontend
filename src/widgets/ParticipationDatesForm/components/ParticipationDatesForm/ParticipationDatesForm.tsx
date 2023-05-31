import React from "react";

import { Button, Variant } from "shared/ui/Button";

import DateCheckboxes from "../DateCheckboxes/DateCheckboxes";
import DateEndRequests from "../DateEndRequests/DateEndRequests";
import DatePeriods from "../DatePeriods/DatePeriods";
import DateRangeSlider from "../DateRangeSlider/DateRangeSlider";

import styles from "./ParticipationDatesForm.module.scss";

export const ParticipationDatesForm = () => (
    <form className={styles.form}>
        <DatePeriods />
        <DateCheckboxes />
        <DateRangeSlider />
        <DateEndRequests />
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
