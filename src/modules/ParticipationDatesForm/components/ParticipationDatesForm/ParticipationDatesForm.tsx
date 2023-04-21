import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";
import plusIcon from "@assets/icons/plus-icon.svg";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import DateCheckboxes from "../DateCheckboxes/DateCheckboxes";
import DateInputs from "../DateInputs/DateInputs";
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

    const onAddBtnClick = () => {};

    return (
        <form className={styles.form}>
            <div className={styles.dates}>
                <DateInputs />
                <button onClick={onAddBtnClick} className={styles.addBtn}>
                    <img className={styles.plus} src={plusIcon} alt="plus" />
                    Добавить период
                </button>
            </div>
            <div className={styles.datesCheckboxes}>
                <DateCheckboxes />
            </div>
            <DateRangeSlider />
            <Button className={styles.btn} rounded variant={Variant.PRIMARY}>
                Сохранить
            </Button>
        </form>
    );
};

export default ParticipationDatesForm;
