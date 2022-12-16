import React, { FC } from "react";

import FileUpload from "@/components/FileUpload/FileUpload";
import InputField from "@/components/InputField/InputField";
import Button from "@/components/ui/Button/Button";

import styles from "./ProfileInfoForm.module.scss";

interface ProfileInfoFormProps {
    isLocked: boolean;
}

const ProfileInfoForm: FC<ProfileInfoFormProps> = ({ isLocked }) => {
    return (
        <form className={styles.wrapper}>
            <div className={styles.general}>
                <div className={styles.name}>
                    <InputField
                        text={"Имя"}
                        type={"text"}
                        defaultValue={"Владислав"}
                        disabled={isLocked}
                    />
                    <InputField
                        text={"Фамилия"}
                        type={"text"}
                        defaultValue={"Александров"}
                        disabled={isLocked}
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
                    disabled={isLocked}
                />
                <InputField
                    text={"Телефон"}
                    type={"text"}
                    defaultValue={"+79827922680"}
                    disabled={isLocked}
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
                Сохранить
            </Button>
        </form>
    );
};

export default ProfileInfoForm;
