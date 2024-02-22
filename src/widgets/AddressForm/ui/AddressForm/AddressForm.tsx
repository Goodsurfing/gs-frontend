import { memo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MapWithAddress } from "@/features/MapWithAddress";
import type { AddressFormFormFields } from "../../model/types/addressForm";
import Button from "@/shared/ui/Button/Button";

import styles from "./AddressForm.module.scss";

interface AddressFormProps {
    className?: string;
}

export const AddressForm = memo(({ className }: AddressFormProps) => {
    const { handleSubmit, control } = useForm<AddressFormFormFields>({ mode: "onChange" });
    const { t } = useTranslation("offer-where");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = handleSubmit((data) => {

    });

    return (
        <form className={className} onSubmit={onSubmit}>
            <MapWithAddress control={control} data={{ address: "" }} />
            <Button
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
                className={styles.btn}
                onClick={onSubmit}
                type="submit"
            >
                {t("Сохранить")}
            </Button>
        </form>
    );
});
