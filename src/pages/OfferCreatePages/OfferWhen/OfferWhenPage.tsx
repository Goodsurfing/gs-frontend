import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import styles from "./OfferWhenPage.module.scss";
import Button from "@/components/ui/Button/Button";
import { Variant } from "@/components/ui/Button/Button.interface";
import OffersWhenCalendar from "./OffersWhenCalendar/OffersWhenCalendar";
import plusIcon from '@assets/icons/plus-icon.svg';
import Checkbox from "@/components/Checkbox/Checkbox";
import OffersWhenCheckboxes from "./OffersWhenCheckboxes/OffersWhenCheckboxes";
import OffersWhenSlider from "./OffersWhenSlider/OffersWhenSlider";
import SwitchComponent from "@/components/mui/Switch/Switch";

interface IOfferWhenForm {
    startDates: Array<Date>;
    endDates: Array<Date>;
    allYearAround: boolean;
    lastMomentAccept: boolean;
    participationPeriod: Array<[Date, Date]>;
    deadlineDate: Date;
}

const OfferWhenPage = () => {
    const onSubmit: SubmitHandler<IOfferWhenForm> = async (data) => {
        console.log(data);
    };

    const { handleSubmit, control } = useForm({
        mode: "onChange"
    });


    const onAddBtnClick = () => {
        
    }

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>
                Укажите на какой срок или сроки вам нужен волонтер
            </h1>
            <form className={styles.form}>
                <div className={styles.dates}>
                    <OffersWhenCalendar />
                    <button onClick={onAddBtnClick} className={styles.addBtn}>
                        <img className={styles.plus} src={plusIcon} alt="plus" />
                        Добавить период
                    </button>
                </div>
                <div className={styles.datesCheckboxes}>
                    <OffersWhenCheckboxes />
                </div>
                <OffersWhenSlider />
                <Button className={styles.btn} rounded variant={Variant.PRIMARY}>
                    Сохранить
                </Button>
            </form>
        </div>
    );
};

export default OfferWhenPage;
