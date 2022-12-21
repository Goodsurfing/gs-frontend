import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import InputField from "@/components/InputField/InputField";

import styles from "./ContactsFormGroup.module.scss";

interface IFields {
    email: string | null;
    phoneNumber: string | null;
}

interface ContactsFormGroupProps {
    control: Control;
    isLocked: boolean;
    data: IFields;
}

const ContactsFormGroup: FC<ContactsFormGroupProps> = ({
    control,
    isLocked,
    data,
}) => {
    return (
        <div className={styles.contacts}>
            <Controller
                control={control}
                name={"email"}
                defaultValue={data.email}
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
                defaultValue={data.phoneNumber}
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
