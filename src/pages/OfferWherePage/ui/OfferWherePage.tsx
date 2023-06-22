import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";
import { SideMenuData } from "@/shared/data/offer-pages";
import { PageLayout } from "@/widgets/PageLayout";
// import YMapWithAddress from "@/components/Ymaps/YMapWithAddress/YMapWithAddress";

import styles from "./OfferWherePage.module.scss";
import YMap from "@/components/YMap/YMap";

export interface IOfferWherePageForm {
    address: string;
}

const OfferWherePage = () => {
    const onSubmit: SubmitHandler<IOfferWherePageForm> = async (data) => {
        console.log(data);
    };

    const { control, handleSubmit } = useForm<IOfferWherePageForm>({
        mode: "onChange",
    });

    return (
        <PageLayout sidebarContent={SideMenuData}>
            <div className={styles.wrapper}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.ymaps}>
                        {/* <YMapWithAddress
                        width="300px"
                        height="300px"
                        data={{ address: "" }}
                        control={control}
                    /> */}
                        <YMap />
                    </div>
                    <Button
                        rounded
                        variant={Variant.PRIMARY}
                        className={styles.btn}
                    >
                        Сохранить
                    </Button>
                </form>
            </div>
        </PageLayout>
    );
};

export default OfferWherePage;
