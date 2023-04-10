import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import styles from "./OfferWhenPage.module.scss";
import Button from "@/components/ui/Button/Button";
import { Variant } from "@/components/ui/Button/Button.interface";
import DatePicker from "@/components/DatePicker/DatePicker";
import CalendarComponent from "@/components/ui/CalendarComponent/CalendarComponent";
import OffersWhereCalendar from "../OfferWhere/OffersWhereCalendar/OffersWhereCalendar";

interface IOfferWhenPage {
    startDates: Array<Date>;
    endDates: Array<Date>;
    allYearAround: boolean;
    lastMomentAccept: boolean;
    participationPeriod: Array<[Date, Date]>;
    deadlineDate: Date;
}

const OfferWhenPage = () => {
    const onSubmit: SubmitHandler<IOfferWhenPage> = async (data) => {
        console.log(data);
    };

    const { handleSubmit, control } = useForm({
        mode: "onChange"
    });


    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>
                Укажите на какой срок или сроки вам нужен волонтер
            </h1>
            <form>
                <OffersWhereCalendar />
                <Button className={styles.btn} rounded variant={Variant.PRIMARY}>
                    Сохранить
                </Button>
            </form>
        </div>
    );
};

export default OfferWhenPage;
