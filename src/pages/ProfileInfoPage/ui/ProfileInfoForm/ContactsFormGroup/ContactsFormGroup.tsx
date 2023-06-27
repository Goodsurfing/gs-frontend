import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";
import Input from "@/shared/ui/Input/Input";

import {
    IContactsFormGroup,
    IUserInfoForm,
} from "../ProfileInfoForm.interface";
import styles from "./ContactsFormGroup.module.scss";

interface ContactsFormGroupProps {
    control: Control<IUserInfoForm>;
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
                        <Input
                            id="e-mail"
                            onChange={(e) => {
                                return field.onChange(e);
                            }}
                            value={field.value}
                            label="E-mail"
                            type="text"
                            disabled={isLocked}
                        />
                    );
                }}
            />
            <Controller
                control={control}
                name="phone"
                defaultValue={data.phone || ""}
                render={({ field }) => {
                    return (
                        <Input
                            id="phone"
                            onChange={(e) => {
                                return field.onChange(e);
                            }}
                            value={field.value}
                            label="Телефон"
                            name="phone"
                            placeholder="+(x)-xxx-xxx-xx-xx"
                            type="phone"
                            disabled={isLocked}
                        />
                    );
                }}
            />
        </div>
    );
};

export default ContactsFormGroup;