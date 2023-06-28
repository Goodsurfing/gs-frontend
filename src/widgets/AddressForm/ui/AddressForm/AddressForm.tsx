import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { MapWithAddress } from "@/features/MapWithAddress";
import type { AddressFormFormFields } from "../../model/types/addressForm";
import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";

import styles from "./AddressForm.module.scss";

interface AddressFormProps {
    className?: string;
}

export const AddressForm = memo(({ className }: AddressFormProps) => {
    const { handleSubmit, control } = useForm<AddressFormFormFields>({ mode: "onChange" });
    const onSubmit = handleSubmit((data) => {
        console.log("submit", data);
    });

    return (
        <form className={className} onSubmit={onSubmit}>
            <MapWithAddress control={control} data={{ address: "" }} />
            <Button className={styles.btn} onClick={onSubmit} variant={Variant.PRIMARY} type="submit">
                Сохранить
            </Button>
        </form>
    );
});
