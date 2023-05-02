import React from "react";

import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";

import EventName from "../EventName/EventName";
import Categories from "../Categories/Categories";
import ShortDescription from "../ShortDescription/ShortDescription";
import FullDescription from "../FullDescription/FullDescription";

import styles from './InviteDescriptionForm.module.scss';
import InputFile from "../ImageUpload/ImageUpload";

export const InviteDescriptionForm = () => {
    const onSubmit = () => {};
    return (
        <form onSubmit={onSubmit}>
            <div className={styles.formWrapper}>
                <EventName />
                <Categories />
                <ShortDescription />
                <FullDescription />
                <InputFile />
            </div>
            <Button className={styles.btn} rounded variant={Variant.PRIMARY}>Сохранить</Button>
        </form>
    );
};

