import React, { FC } from "react";

import FileUpload from "@/components/FileUpload/FileUpload";
import InputField from "@/components/InputField/InputField";

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
        </form>
    );
};

export default ProfileInfoForm;
