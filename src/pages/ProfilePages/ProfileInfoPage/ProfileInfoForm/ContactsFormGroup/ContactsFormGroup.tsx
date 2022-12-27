import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import InputField from "@/components/InputField/InputField";

import { IContactsFormGroup, IUserInfo } from "../ProfileInfoForm.interface";
import styles from "./ContactsFormGroup.module.scss";

interface ContactsFormGroupProps {
    control: Control<IUserInfo>;
    isLocked: boolean;
    data: IContactsFormGroup;
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
                name="email"
                defaultValue={data.email}
                render={({ field }) => {
                    return (
                        <InputField
                            onChange={(e) => {
                                return field.onChange(e);
                            }}
                            value={field.value}
                            text="E-mail"
                            type="text"
                            disabled={isLocked}
                        />
                    );
                }}
            />
            {/* <Controller
                control={control}
                name="phoneNumber"
                defaultValue={data.email}
                render={({ field }) => {
                    return (
                        <InputField
                            onChange={(e) => {
                                return field.onChange(e);
                            }}
                            value={field.value}
                            text="Телефон"
                            type="phone"
                            disabled={isLocked}
                        />
                    );
                }}
            /> */}
        </div>
    );
};

export default ContactsFormGroup;
