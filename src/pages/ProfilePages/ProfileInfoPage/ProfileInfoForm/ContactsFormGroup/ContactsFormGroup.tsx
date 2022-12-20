import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import InputField from "@/components/InputField/InputField";

import styles from "./ContactsFormGroup.module.scss";

interface ContactsFormGroupProps {
    control: Control;
    isLocked: boolean;
}

const ContactsFormGroup: FC<ContactsFormGroupProps> = ({
    control,
    isLocked,
}) => {
    return (
        <div className={styles.contacts}>
            <Controller
                control={control}
                name={"email"}
                defaultValue={"space-cowboy@gmail.com"}
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        text={"E-mail"}
                        type={"text"}
                        disabled={isLocked}
                    />
                )}
            />
            <Controller
                control={control}
                name={"phoneNumber"}
                defaultValue={"+79827922680"}
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        text={"Телефон"}
                        type={"phone"}
                        disabled={isLocked}
                    />
                )}
            />
        </div>
    );
};

export default ContactsFormGroup;
