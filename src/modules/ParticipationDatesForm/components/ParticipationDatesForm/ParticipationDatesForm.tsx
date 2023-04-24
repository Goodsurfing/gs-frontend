import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import DateCheckboxes from "../DateCheckboxes/DateCheckboxes";
import DateInputs from "../DateInputs/DateInputs";
import DatePeriods from "../DatePeriods/DatePeriods";
import DateRangeSlider from "../DateRangeSlider/DateRangeSlider";
import styles from "./ParticipationDatesForm.module.scss";
import { IParticipationDatesForm } from "./types";

const ParticipationDatesForm = () => {
    const onSubmit: SubmitHandler<IParticipationDatesForm> = async (data) => {
        console.log(data);
    };

    const { handleSubmit, control } = useForm({
        mode: "onChange",
    });

    return (
        <form className={styles.form}>
            <DatePeriods />
            <DateCheckboxes />
            <DateRangeSlider />
            <Button className={styles.btn} rounded variant={Variant.PRIMARY}>
                Сохранить
            </Button>
        </form>
    );
};

export default ParticipationDatesForm;
