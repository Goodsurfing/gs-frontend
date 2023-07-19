import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";

import DateCheckboxes from "../DateCheckboxes/DateCheckboxes";
import DateEndRequests from "../DateEndRequests/DateEndRequests";
import DatePeriods from "../DatePeriods/DatePeriods";
import DateRangeSlider from "../DateRangeSlider/DateRangeSlider";
import styles from "./ParticipationDatesForm.module.scss";
import { IParticipationDatesForm } from "./types";

export const ParticipationDatesForm = () => {
    const onSubmit: SubmitHandler<IParticipationDatesForm> = async (data) => {
        console.log(data);
    };

    const { handleSubmit, control } = useForm<IParticipationDatesForm>({
        mode: "onChange",
    });

    return (
        <form className={styles.form}>
            <DatePeriods />
            <DateCheckboxes />
            <DateRangeSlider />
            <DateEndRequests />
            <Button
                onClick={handleSubmit(onSubmit)}
                className={styles.btn}
                rounded
                variant={Variant.PRIMARY}
            >
                Сохранить
            </Button>
        </form>
    );
};
