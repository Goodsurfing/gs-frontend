import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { MapWithAddress } from "@/features/MapWithAddress";

import Button from "@/shared/ui/Button/Button";

import { addressFormSchema } from "../../model/types/addressForm";
import styles from "./AddressForm.module.scss";

interface AddressFormProps {
    className?: string;
}

export const AddressForm = memo(({ className }: AddressFormProps) => {
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<z.infer<typeof addressFormSchema>>({
        resolver: zodResolver(addressFormSchema),
        mode: "onChange",
        defaultValues: {
            address: "",
        },
    });
    const { t } = useTranslation("offer-where");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = handleSubmit((data) => {
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleCoordinatesChange = (coordinates: string | undefined) => {
        if (coordinates) return coordinates;
    };

    return (
        <form className={className} onSubmit={onSubmit}>
            {errors.address && (
                <p className={styles.error}>
                    {errors.address.message}
                </p>
            )}
            <MapWithAddress control={control} data={{ address: "" }} onCoordinatesChange={} />
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
