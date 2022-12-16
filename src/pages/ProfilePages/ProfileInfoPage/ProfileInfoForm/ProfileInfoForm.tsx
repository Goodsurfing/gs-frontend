import React, { FC } from "react";

import FileUpload from "@/components/FileUpload/FileUpload";
import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import styles from "./ProfileInfoForm.module.scss";

const ProfileInfoForm: FC = () => {
    return (
        <form className={styles.wrapper}>
            <div className={styles.general}>
                <div className={styles.name}>
                    <InputField
                        text={"Имя"}
                        type={"text"}
                        defaultValue={"Владислав"}
                    />
                    <InputField
                        text={"Фамилия"}
                        type={"text"}
                        defaultValue={"Александров"}
                    />
                </div>
                <div className={styles.avatar}>
                    <FileUpload />
                </div>
            </div>
            <div className={styles.contacts}>
                <InputField
                    text={"E-mail"}
                    type={"text"}
                    defaultValue={"space-cowboy1982@bk.ru"}
                />
                <InputField
                    text={"Телефон"}
                    type={"text"}
                    defaultValue={"+79827922680"}
                />
            </div>
            <div className={styles.about}>
                <InputField
                    text={"Расскажите о себе"}
                    type={"text"}
                    defaultValue={"Веселый, добрый"}
                />
            </div>
            <Button variant={"primary"} className={styles.button}>
                Дальше
            </Button>
        </form>
    );
};

export default ProfileInfoForm;
