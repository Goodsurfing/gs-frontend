import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { useParams } from "react-router-dom";
import { MapWithAddress } from "@/features/MapWithAddress";

import Button from "@/shared/ui/Button/Button";

import { addressFormSchema } from "../../model/types/addressForm";
import styles from "./AddressForm.module.scss";
import { useUpdateWhereMutation } from "@/entities/Offer";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

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
    const { id } = useParams();
    const [updateWhere, { isError, isLoading }] = useUpdateWhereMutation();
    const [toast, setToast] = useState<ToastAlert>();

    const onSubmit = handleSubmit(async (data) => {
        await updateWhere({ body: { id, where: data } })
            .unwrap()
            .then(() => {
                setToast({
                    text: "Адрес успешно изменён",
                    type: HintType.Success,
                });
            })
            .catch(() => {
                setToast({
                    text: "Произошла ошибка",
                    type: HintType.Error,
                });
            });
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleCoordinatesChange = (coordinates: string | undefined) => {
        if (coordinates) return coordinates;
    };

    return (
        <form className={className} onSubmit={onSubmit}>
            {isError && toast && (
                <HintPopup text={toast.text} type={toast.type} />
            )}
            {errors.address && (
                <p className={styles.error}>
                    {errors.address.message}
                </p>
            )}
            <MapWithAddress control={control} data={{ address: "" }} onCoordinatesChange={handleCoordinatesChange} />
            <Button
                variant="FILL"
                disabled={isLoading}
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
